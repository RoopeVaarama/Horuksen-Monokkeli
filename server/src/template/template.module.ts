import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ValueSearch, ValueSearchSchema } from './schemas/value-search.schema';
import { TemplateController } from './template.controller';
import { TemplateService } from './template.service';

@Module({
    imports: [MongooseModule.forFeature([{ name: ValueSearch.name, schema: ValueSearchSchema }]),],
    controllers: [TemplateController],
    providers: [TemplateService],
})
export class TemplateModule {}
