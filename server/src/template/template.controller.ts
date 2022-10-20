import { Body, Controller, Get, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { ValueSearch } from './schemas/value-search.schema';
import { TemplateService } from './template.service';

@ApiTags('templates')
@Controller('template')
export class TemplateController {

    constructor(
        private readonly templateService: TemplateService
    ) { }

    // create a new search template
    @Post('/create')
    @ApiCreatedResponse({ status: 200, description: 'Template created', type: ValueSearch })
    @UsePipes(new ValidationPipe({ transform: true }))
    async newTemplate(@Body() search: ValueSearch): Promise<ValueSearch> {
        return await this.templateService.createTemplate(search);
    }

    // returns all templates of a user
    @Get('/templates/:uid')
    @ApiCreatedResponse({ status: 200, description: 'Templates of user fetched', type: [ValueSearch] })
    async getTemplates(@Param('uid') uid: string): Promise<ValueSearch[]> {
        return await this.templateService.getTemplates(uid);
    }
}
