import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UploadedFile,
  UseInterceptors,
  Res,
  StreamableFile,
  Header,
  HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse, ApiConsumes, ApiResponse, ApiTags, ApiBody } from '@nestjs/swagger';
import { FileService } from './file.service';

@ApiTags('file')
@Controller('/file')
export class FileController {
  constructor(private readonly service: FileService) {}

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ status: 200, description: 'All users returned', type: Object })
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
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    return response;
  }

  @Get('/get')
  @ApiResponse({ status: 200, description: 'All users returned', type: [String] })
  async getFile(): Promise<string[]> {
    return await this.service.getAllFiles();
  }
}
