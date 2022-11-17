import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  Res,
  StreamableFile,
  Header,
  HttpException,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiResponse, ApiTags, ApiBody, ApiNotFoundResponse } from '@nestjs/swagger';
import { FileService } from './file.service';
import { ListService } from './list.service';
import { FileMeta, FileMetaDocument } from './schemas/filemeta.schema';
import { FileList } from './schemas/filelist.schema';
import { Model } from 'mongoose';
import { ParseService } from 'src/search/parse.service';

@ApiTags('files')
@Controller('/files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly listService: ListService,
    private readonly parseService: ParseService,
  ) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 201, description: 'File successfully uploaded', type: Object })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'pdf' })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<FileMeta> {
    const fileMetaToReturn = await this.fileService.createFileMeta(file);
    try {
      await this.parseService.parsePdf(fileMetaToReturn.filepath);
    } catch (err) {
      await this.fileService.deleteFile(
        (await this.fileService.getFileId(fileMetaToReturn.filepath)).at(0)._id,
      );
      throw new HttpException('No content in PDF. File not uploaded.', 204);
    }
    return fileMetaToReturn;
  }

  @Get('/')
  @ApiResponse({ status: 200, description: 'All files returned', type: [FileMeta] })
  async getFiles(): Promise<FileMeta[]> {
    return await this.fileService.getFiles();
  }

  @Delete('/:id')
  @ApiResponse({ status: 200, description: 'File deleted', type: Boolean })
  @ApiNotFoundResponse({
    status: 404,
    description: 'File not found',
  })
  async deleteFile(@Param('id') id: string) {
    return await this.fileService.deleteFile(id);
  }

  //TODO: remove once fron-end doesn't use anymore
  @Get('/get')
  @ApiResponse({ status: 200, description: 'All filenames returned', type: [String] })
  async getFilenames(): Promise<string[]> {
    return await this.fileService.getAllFiles();
  }

  // FileList methods =========================================================

  // TODO: Currently passing bad ObjectId relations causes a server error (500)
  // > Implement relation existance checking for create & update methods
  // > Implement graceful error handling, raise bad request error

  // TODO: Mongo cannot automatically check for duplicate relations
  // > Duplication check in services, check during create & update
  // > Either return an error code, or pass without creating duplicates

  @Post('/list')
  @ApiResponse({ status: 201, description: 'List created succesfully', type: FileList })
  @ApiResponse({
    status: 404,
    description: 'File not found. One or more files could not be found. FileList not created.',
    type: FileList,
  })
  async createFileList(@Body() list: FileList): Promise<FileList> {
    for (let i = 0; i <= list.files.length; ++i) {
      await this.fileService.canFileBeFound(list.files.at(i).toString());
    }
    return await this.listService.createFileList(list);
  }

  @Get('/list')
  @ApiResponse({ status: 200, description: 'Lists retrieved succesfully', type: [FileList] })
  async getAllLists(): Promise<FileList[]> {
    return await this.listService.getAll();
  }

  @Get('/list/:id')
  @ApiResponse({ status: 200, description: 'List retrieved succesfully', type: FileList })
  async getOneList(@Param('id') id: string): Promise<FileList> {
    return await this.listService.getOne(id);
  }

  @Patch('/list/:id')
  @ApiResponse({ status: 200, description: 'List updated succasfully', type: FileList })
  async updateFileList(@Param('id') id: string, @Body() list: FileList) {
    return await this.listService.updateFileList(id, list);
  }

  @Delete('/list/:id')
  @ApiResponse({ status: 200, description: 'List deleted succesfully', type: Boolean })
  @ApiResponse({
    status: 404,
    description: 'List not found. No list with given id could be found.',
    type: Boolean,
  })
  async deleteFileList(@Param('id') listId: string) {
    return await this.listService.deleteFileList(listId);
  }

  @Patch('/list/files/:listId')
  @ApiResponse({ status: 200, description: 'Files added to list', type: Boolean })
  async addFilesTtoList(
    @Param('listId') listId: string,
    @Body() fileIds: string[],
  ): Promise<FileList> {
    await this.listService.canListBeFound(listId);
    const metas: FileMeta[] = await this.fileService.getFilesByIds(fileIds);
    return await this.listService.addFilesToFileList(listId, metas);
  }
  @Delete('/list/files/:listId')
  @ApiResponse({ status: 200, description: 'Files deleted from list', type: Boolean })
  async deleteFilesFromFileList(
    @Param('listId') listId: string,
    @Body() fileIds: string[],
  ): Promise<FileList> {
    await this.listService.canListBeFound(listId);
    const metas: FileMeta[] = await this.fileService.getFilesByIds(fileIds);
    return await this.listService.removeFilesFromFileList(listId, metas);
  }
}
