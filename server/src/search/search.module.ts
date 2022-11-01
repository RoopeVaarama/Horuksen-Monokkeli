import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ParseService } from './parse.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TemplateService } from '../template/template.service';
import { Search, SearchSchema } from './schemas/search.schema';
import { Template, TemplateSchema } from '../template/schemas/template.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Search.name, schema: SearchSchema }]),
    MongooseModule.forFeature([{ name: Template.name, schema: TemplateSchema }]),
  ],
  providers: [SearchService, ParseService, TemplateService],
  controllers: [SearchController],
  exports: [SearchService, ParseService],
})
export class SearchModule {}
