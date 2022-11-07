import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ParseService } from './parse.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TemplateService } from '../template/template.service';
import { Search, SearchSchema } from './schemas/search.schema';
import { Template, TemplateSchema } from '../template/schemas/template.schema';
import { FileService } from '../file/file.service';
import { FileMeta, FileMetaSchema } from '../file/schemas/filemeta.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Search.name, schema: SearchSchema }]),
    MongooseModule.forFeature([{ name: Template.name, schema: TemplateSchema }]),
    MongooseModule.forFeature([{ name: FileMeta.name, schema: FileMetaSchema }]),
  ],
  providers: [SearchService, ParseService, TemplateService, FileService],
  controllers: [SearchController],
  exports: [SearchService, ParseService],
})
export class SearchModule {}
