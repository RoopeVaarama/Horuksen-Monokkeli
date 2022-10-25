import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { FileMeta, FileMetaSchema } from './schemas/filemeta.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FileMeta.name, schema: FileMetaSchema }]),
    MulterModule.register({ dest: './test_pdfs' }),
  ],
  providers: [FileService],
  controllers: [FileController],
  exports: [FileService],
})
export class FileModule {}
