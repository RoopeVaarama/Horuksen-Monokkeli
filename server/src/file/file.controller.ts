import { Controller, Get, Post, Body, Param, UploadedFile, UseInterceptors, Res, StreamableFile, Header, HttpException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import multer from 'multer';
import { PDFExtractResult } from 'pdf.js-extract';
import { createReadStream, existsSync } from 'fs';
import path, { join } from 'path';

@Controller('file')
export class FileController {
    constructor(

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

    @Get('/get/:filename')
    @Header('Content-Type', 'application/pdf')
    getFile(@Param('filename') filename: string): StreamableFile {
        const filePath = 'test_pdfs/' + filename;
        if(!existsSync(filePath)){
            throw new HttpException("File not found.", 404);
        }
        const file = createReadStream(join(process.cwd(), filePath));
        return new StreamableFile(file);;
    }
}