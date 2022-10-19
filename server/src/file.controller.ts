import { Controller, Get, Post, Body, Param, UploadedFile, UseInterceptors, Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import multer from 'multer';
import { PDFExtractResult } from 'pdf.js-extract';

@Controller('file')
export class FileController {
    constructor(

    ) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('image'))
    async uploadFile(@UploadedFile() file: Express.Multer.File) {
        console.log(file);
        const response = {
            originalname: file.originalname,
            filename: file.filename,
        };
        return response;
    }

    @Get(':imgpath')
    seeUploadedFile(@Param('imgpath') image, @Res() res) {
        return res.sendFile(image, { root: './files' });
    }

}