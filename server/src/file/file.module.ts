import { Module } from '@nestjs/common';
import { FileController } from './file.controller';
import { MulterModule } from '@nestjs/platform-express';

@Module({
    imports: [MulterModule.register({
      dest: './files',
    })],
    controllers: [FileController],
  })
export class FileModule { }
