import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ParseService } from './parse.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TemplateService } from '../template/template.service';
import { Search, SearchSchema } from './schemas/search.schema';
import { ValueSearch, ValueSearchSchema } from '../template/schemas/value-search.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Search.name, schema: SearchSchema }]),
    MongooseModule.forFeature([{ name: ValueSearch.name, schema: ValueSearchSchema }]),
  ],
  providers: [SearchService, ParseService, TemplateService],
  controllers: [SearchController],
  exports: [SearchService, ParseService],
})
export class SearchModule {}
