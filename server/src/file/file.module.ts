import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { FileController } from './file.controller';
import { FileService } from './file.service';
import { ListService } from './list.service';
import { FileMeta, FileMetaSchema } from './schemas/filemeta.schema';
import { FileList, FileListSchema } from './schemas/filelist.schema';
import { ParseService } from 'src/search/parse.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: FileMeta.name, schema: FileMetaSchema }]),
    MongooseModule.forFeature([{ name: FileList.name, schema: FileListSchema }]),
    MulterModule.register({ dest: './files' }),
  ],
  providers: [FileService, ListService, ParseService],
  controllers: [FileController],
  exports: [FileService, ListService],
})
export class FileModule {}
