import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { ParseService } from "./parse.service";
import { TemplateService } from './template.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ValueSearch, ValueSearchSchema } from './schemas/valueSearch.schema';

@Module({
    imports: [MongooseModule.forFeature([{ name: ValueSearch.name, schema: ValueSearchSchema }]),],
    providers: [SearchService, ParseService, TemplateService],
    controllers: [SearchController],
    exports: [SearchService, ParseService],
})
export class SearchModule { }
