import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ParseService } from "./parse.service";

@Module({
  providers: [SearchService, ParseService],
  controllers: [SearchController],
  exports: [SearchService, ParseService],
})
export class SearchModule { }
