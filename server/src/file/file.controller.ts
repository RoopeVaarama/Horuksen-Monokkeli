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
  HttpException,
  ParseFilePipe,
  FileTypeValidator,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiConsumes,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiNotFoundResponse,
  ApiOperation,
  ApiBadRequestResponse,
} from '@nestjs/swagger';
import { FileService } from './file.service';
import { ListService } from './list.service';
import { FileMeta, FileMetaDocument } from './schemas/filemeta.schema';
import { FileList } from './schemas/filelist.schema';
import { Model } from 'mongoose';
import { ParseService } from '../search/parse.service';
import { deprecate } from 'util';
import { createReadStream } from 'fs';
import { join } from 'path';
import { Response, Request } from 'express';

@ApiTags('files')
@Controller('/files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly listService: ListService,
    private readonly parseService: ParseService,
  ) {}

  @Get('/read/:id')
  @ApiOkResponse({ description: 'File read succesfully', type: StreamableFile })
  @ApiBadRequestResponse({ description: 'Invalid request parameters' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async read(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
    @Req() request: Request,
  ): Promise<StreamableFile> {
    const userId = await request.user['_id'].toString();
    const meta = await this.fileService.getFileMeta(id, userId);
    const file = createReadStream(join(process.cwd(), meta.filepath));
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `filename="${meta.filename}"`,
    });
    return new StreamableFile(file);
  }

  @Post('/upload')
  @ApiOperation({ summary: 'Uploads single .pdf file.' })
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
    @Req() request: Request,
  ): Promise<FileMeta> {
    const userId = await request.user['_id'].toString();
    const fileMetaToReturn = await this.fileService.createFileMeta(file, userId);
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
  @ApiOperation({ summary: 'Returns all FileMetas.' })
  @ApiResponse({ status: 200, description: 'All files returned', type: [FileMeta] })
  async getFiles(@Req() request: Request): Promise<FileMeta[]> {
    const userId = await request.user['_id'].toString();
    return await this.fileService.getFiles(userId);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Deletes file matching given ID.' })
  @ApiResponse({ status: 200, description: 'File deleted', type: Boolean })
  @ApiNotFoundResponse({
    status: 404,
    description: 'File not found. No file with given ID could be found.',
  })
  async deleteFile(@Param('id') id: string, @Req() request: Request) {
    const userId = await request.user['_id'].toString();
    if (!(await this.fileService.doesUserOwnFile(userId, id))) throw new UnauthorizedException();
    return await this.fileService.deleteFile(id);
  }

  // FileList methods =========================================================

  // TODO: Mongo cannot automatically check for duplicate relations
  // > Duplication check in services, check during create & update
  // > Either return an error code, or pass without creating duplicates

  //TODO: When creating list, make sure other peoples files can't be added to it
  @Post('/list')
  @ApiOperation({ summary: 'Creates single FileList with given name and (optinal) files.' })
  @ApiResponse({ status: 201, description: 'List created succesfully', type: FileList })
  @ApiResponse({
    status: 404,
    description: 'File not found. One or more files could not be found. FileList not created.',
    type: FileList,
  })
  async createFileList(@Body() list: FileList, @Req() request: Request): Promise<FileList> {
    const userId = await request.user['_id'].toString();
    for (let i = 0; i < list.files.length; ++i) {
      await this.fileService.doesUserOwnFile(userId, list.files.at(i).toString());
    }
    list.author = userId;
    return await this.listService.createFileList(list);
  }

  @Get('/list')
  @ApiOperation({ summary: 'Returns all FileLists' })
  @ApiResponse({ status: 200, description: 'Lists retrieved succesfully', type: [FileList] })
  async getAllLists(@Req() request: Request): Promise<FileList[]> {
    const userId = await request.user['_id'].toString();
    return await this.listService.getAll(userId);
  }

  @Get('/list/:id')
  @ApiOperation({ summary: 'Returns FileList matching given ID.' })
  @ApiResponse({ status: 200, description: 'List retrieved succesfully', type: FileList })
  async getOneList(@Param('id') id: string, @Req() request: Request): Promise<FileList> {
    const userId = await request.user['_id'].toString();
    return await this.listService.getOne(id, userId);
  }

  @Patch('/list/:id')
  @ApiOperation({ summary: 'Upadtes (overwrites) FileList matching given ID.' })
  @ApiResponse({ status: 200, description: 'List updated succasfully', type: FileList })
  @ApiResponse({
    status: 404,
    description:
      'File not found. One or more files could not be found. FileList not updated.' +
      '\n OR \n List not found. No FileList with ID could be found. FileList not updated.',
    type: FileList,
  })
  async updateFileList(@Param('id') id: string, @Body() list: FileList, @Req() request: Request) {
    const userId = await request.user['_id'].toString();
    for (let i = 0; i < list.files.length; ++i) {
      //Also checks if file exists at the same time
      if (!(await this.fileService.doesUserOwnFile(userId, list.files.at(i).toString()))) {
        throw new UnauthorizedException();
      }
    }
    return await this.listService.updateFileList(id, list);
  }

  @Delete('/list/:id')
  @ApiOperation({
    summary: 'Deletes FileList matching given ID. Does not delete files inside list.',
  })
  @ApiResponse({ status: 200, description: 'List deleted succesfully', type: Boolean })
  @ApiResponse({
    status: 404,
    description: 'List not found. No list with given id could be found.',
    type: Boolean,
  })
  async deleteFileList(@Param('id') listId: string, @Req() request: Request) {
    const userId = await request.user['_id'].toString();
    return await this.listService.deleteFileList(listId, userId);
  }

  @Patch('/list/files/:listId')
  @ApiOperation({ summary: 'Adds given files to FileList matching given ID.' })
  @ApiResponse({ status: 200, description: 'Files added to list', type: Boolean })
  async addFilesTtoList(
    @Param('listId') listId: string,
    @Body() fileIds: string[],
    @Req() request: Request,
  ): Promise<FileList> {
    const userId = await request.user['_id'].toString();
    if (!(await this.listService.doesUserOwnFileList(userId, listId))) {
      throw new UnauthorizedException();
    }
    const metas: FileMeta[] = await this.fileService.getFilesByIds(fileIds, userId);
    return await this.listService.addFilesToFileList(listId, metas);
  }

  @Delete('/list/files/:listId')
  @ApiOperation({ summary: 'Deletes given files from FileList matching given ID.' })
  @ApiResponse({ status: 200, description: 'Files deleted from list', type: Boolean })
  async deleteFilesFromFileList(
    @Param('listId') listId: string,
    @Body() fileIds: string[],
    @Req() request: Request,
  ): Promise<FileList> {
    const userId = await request.user['_id'].toString();
    await this.listService.canListBeFound(listId);
    const metas: FileMeta[] = await this.fileService.getFilesByIds(fileIds, userId);
    return await this.listService.removeFilesFromFileList(listId, metas);
  }
}
