import {
  Req,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
  UnauthorizedException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Template } from './schemas/template.schema';
import { TemplateService } from './template.service';
import { UserDocument } from '../user/user.schema';

@ApiTags('templates')
@Controller('/template')
export class TemplateController {
  constructor(private readonly templateService: TemplateService) {}

  @Post('/')
  @ApiOperation({ summary: 'Creates new template using body contents' })
  @ApiCreatedResponse({ description: 'Template created succesfully', type: Template })
  @ApiBadRequestResponse({ description: 'Invalid or missing request body' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async createTemplate(@Body() template: Template, @Req() req: Request): Promise<Template> {
    if (!req.user) throw new UnauthorizedException('User is not logged in');
    if (!template) throw new BadRequestException('Template is not defined');
    template.author = req.user['_id'];
    return await this.templateService.createTemplate(template);
  }

  @Get('/')
  @ApiOperation({ summary: 'Returns array of all templates authored by current user' })
  @ApiOkResponse({ description: 'Template list retrieved successfully', type: [Template] })
  @ApiBadRequestResponse({ description: 'Invalid or missingrequest parameters' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  async getTemplates(@Req() req: Request) {
    if (!req.user) throw new UnauthorizedException('User is not logged in');
    return await this.templateService.getTemplatesByUserId(req.user['_id']);
  }

  // TO BE REMOVED
  @Get('/u/:uid')
  @ApiOperation({ summary: 'DEPRECATED USE `GET /` INSTEAD. Returns templates matching user ID' })
  @ApiOkResponse({ description: 'Template list for user retrieved successfully', type: Template })
  @ApiBadRequestResponse({ description: 'Invalid or missing request parameters' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  async getTemplatesByUser(@Param('uid') uid: string): Promise<Template[]> {
    return await this.templateService.getTemplatesByUserId(uid);
  }

  @Get('/all')
  @ApiOperation({ summary: 'Returns array of all templates' })
  @ApiOkResponse({ description: 'Template list for user retrieved successfully', type: Template })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  async getAllTemplates(@Req() req: Request): Promise<Template[]> {
    if (!req.user) throw new UnauthorizedException('User is not logged in');
    return await this.templateService.getAllTemplates();
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Returns template with given id' })
  @ApiOkResponse({ description: 'Template retrieved successfully', type: Template })
  @ApiBadRequestResponse({ description: 'Invalid or missing request parameters' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  async getTemplateById(@Param('id') id: string, @Req() req: Request): Promise<Template> {
    if (!req.user) throw new UnauthorizedException('User is not logged in');
    if (!id) throw new BadRequestException('ID is not defined');
    // Read operations can be allowed even if user is not author
    return await this.templateService.getTemplateById(id);
  }

  @Patch('/:id')
  @ApiOperation({ summary: 'Updates template with given id with given template body' })
  @ApiOkResponse({ description: 'Template updated succesfully', type: Boolean })
  @ApiBadRequestResponse({ description: 'Invalid request body or parameters' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'Access to resource is forbidden (user is not author)' })
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateTemplate(
    @Param('id') id: string,
    @Body() template: Template,
    @Req() req: Request,
  ): Promise<Template> {
    if (!req.user) throw new UnauthorizedException('User is not logged in');
    if (!template) throw new BadRequestException('Template is not defined');
    if (!id) throw new BadRequestException('ID is not defined');
    if (!(await this.templateService.verifyAuthor(id, req.user as UserDocument))) {
      throw new ForbiddenException('Access forbidden');
    }
    return await this.templateService.updateTemplate(id, template);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Deletes template with given id' })
  @ApiOkResponse({ description: 'Template deleted succesfully', type: Boolean })
  @ApiBadRequestResponse({ description: 'Invalid request parameters' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'Access to resource is forbidden (user is not author)' })
  async deleteTemplate(@Param('id') id: string, @Req() req: Request): Promise<boolean> {
    if (!req.user) throw new UnauthorizedException('User is not logged in');
    if (!id) throw new BadRequestException('ID is not defined');
    if (!(await this.templateService.verifyAuthor(id, req.user as UserDocument))) {
      throw new ForbiddenException('Access forbidden');
    }
    return await this.templateService.deleteTemplate(id);
  }
}
