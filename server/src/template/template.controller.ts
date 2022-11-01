import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Template, TemplateDocument } from './schemas/template.schema';
import { TemplateService } from './template.service';

@ApiTags('templates')
@Controller('/template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post('/')
  @ApiCreatedResponse({ description: 'Template created succesfully', type: Template })
  @ApiBadRequestResponse({ description: 'Invalid request body' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createTemplate(@Body() template: Template): Promise<Template> {
    const created = (await this.templateService.createTemplate(template)) as TemplateDocument;
    // Return only selected values
    const returnObj = {
      title: created.title,
      author: created.author,
      terms: created.terms,
      _id: created._id,
    };
    return returnObj as Template;
  }

  // FUTURE TODO: Change service to only return documents where author === req.user._id, pass user or _id to service
  // FUTURE TODO: Change service to also return public/shared templates
  // QUESTION: Should terms be excluded from return values to reduce payload?
  @Get('/')
  @ApiOkResponse({ description: 'Template list retrieved successfully', type: [Template] })
  async getTemplates() {
    return await this.templateService.getAllTemplates();
  }

  // This could be removed from final implementation
  @Get('/u/:uid')
  @ApiOkResponse({ description: 'Template list for user retrieved successfully', type: Template })
  @ApiBadRequestResponse({ description: 'Invalid request parameters' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async getTemplatesByUser(@Param('uid') uid: string): Promise<Template[]> {
    return await this.templateService.getTemplatesByUserId(uid);
  }

  @Get('/:id')
  @ApiOkResponse({ description: 'Template retrieved successfully', type: Template })
  @ApiBadRequestResponse({ description: 'Invalid request parameters' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async getTemplateById(@Param('id') id: string): Promise<Template> {
    return this.templateService.getTemplateById(id);
  }

  @Patch('/:id')
  @ApiOkResponse({ description: 'Template updated succesfully', type: Boolean })
  @ApiBadRequestResponse({ description: 'Invalid request body or parameters' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateTemplate(@Param('id') id: string, @Body() template: Template): Promise<Template> {
    return await this.templateService.updateTemplate(id, template);
  }

  @Delete('/:id')
  @ApiOkResponse({ description: 'Template deleted succesfully', type: Boolean })
  @ApiBadRequestResponse({ description: 'Invalid request parameters' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async deleteTemplate(@Param('id') id: string): Promise<boolean> {
    return await this.templateService.deleteTemplate(id);
  }
}
