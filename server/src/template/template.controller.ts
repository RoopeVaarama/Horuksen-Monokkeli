import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateRequest } from './schemas/create-request.schema';
import { ValueSearch } from './schemas/value-search.schema';
import { TemplateService } from './template.service';

@ApiTags('templates')
@Controller('template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  // create new search templates
  @Post('/create')
  @ApiCreatedResponse({
    status: 200,
    description: 'Templates created',
    type: CreateRequest,
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async newTemplate(@Body() request: CreateRequest): Promise<ValueSearch[]> {
    const createdTemplates: ValueSearch[] = [];
    for (let i = 0; i < request.templates.length; ++i) {
      createdTemplates.push(
        await this.templateService.createTemplate(request.templates[i]),
      );
    }
    return createdTemplates;
  }

  // returns all templates of a user
  @Get('/templates/:uid')
  @ApiCreatedResponse({
    status: 200,
    description: 'Templates of user fetched',
    type: [ValueSearch],
  })
  async getTemplates(@Param('uid') uid: string): Promise<ValueSearch[]> {
    return await this.templateService.getTemplates(uid);
  }
}
