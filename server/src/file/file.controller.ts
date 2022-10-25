import {
  Controller,
  Get,
  Post,
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
import { ApiCreatedResponse, ApiConsumes, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { FileService } from './file.service';
import { FileMeta } from './schemas/filemeta.schema';

@ApiTags('files')
@Controller('/files')
export class FileController {
  constructor(private readonly service: FileService) {}

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
    return await this.service.createFileMeta(file);
  }

  @Get('/')
  @ApiResponse({ status: 200, description: 'All files returned', type: [FileMeta] })
  async getFiles(): Promise<FileMeta[]> {
    return await this.service.getFiles();
  }

  @Delete('/:id')
  @ApiResponse({ status: 200, description: 'FileMeta deleted', type: Boolean })
  async deleteFile(@Param('id') id: string) {
    return await this.service.deleteFileMeta(id);
  }

  @Get('/get')
  @ApiResponse({ status: 200, description: 'All filenames returned', type: [String] })
  async getFilenames(): Promise<string[]> {
    return await this.service.getAllFiles();
  }
}
