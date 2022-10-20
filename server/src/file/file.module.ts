import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [MulterModule.register({
      dest: './test_pdfs',
    })],
    controllers: [FileController],
  })
export class FileModule { }
