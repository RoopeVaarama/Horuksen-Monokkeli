import { Controller, Get, Post, Body, Param, UploadedFile, UseInterceptors, Res, StreamableFile, Header, HttpException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';

@Controller('file')
export class FileController {
    constructor(
        private readonly service: FileService
    ) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        const response = {
            originalname: file.originalname,
            filename: file.filename,
        };
        return response;
    }

    @Get('/get')
    async getFile(): Promise<String[]> {
        return await this.service.getFiles();
    }
}