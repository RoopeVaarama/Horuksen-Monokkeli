import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
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
import { ParseService } from './parse.service';
import { SearchService } from './search.service';
import { Result } from './schemas/result.schema';
import { TemplateService } from '../template//template.service';
import { Template } from '../template/schemas/template.schema';
import { Search } from './schemas/search.schema';
import { SearchRequest } from './schemas/search-request.schema';
import { FileService } from '../file/file.service';
import { TemplateSearchRequest } from './schemas/template-search-request';
import { Term } from '../template/schemas/term.schema';
import { Request } from 'express';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(
    private readonly service: SearchService,
    private readonly parseService: ParseService,
    private readonly templateService: TemplateService,
    private readonly fileService: FileService,
  ) {}

  // Performs a search with the received TemplateSearchRequest-object
  @Post('/template_search')
  @ApiOperation({ summary: 'Searches given file ids using terms in given template ids' })
  @ApiCreatedResponse({ description: 'Search completed', type: Search })
  @ApiBadRequestResponse({ description: 'Invalid or missing request parameters' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  async multifileSearchWithId(
    @Body() searchRequest: TemplateSearchRequest,
    @Req() request: Request,
  ): Promise<Search> {
    let results: Result[] = [];
    let terms: Term[] = [];
    const templates: Template[] = [];

    for (let i = 0; i < searchRequest.templates.length; ++i) {
      templates.push(await this.templateService.getTemplateById(searchRequest.templates[i]));
      terms = [...terms, ...templates[i].terms];
    }
    const userId = request.user['_id'].toString();
    for (let i = 0; i < searchRequest.files.length; ++i) {
      const fileId = searchRequest.files[i];
      const file = await this.fileService.getFileMeta(fileId, userId);
      const contents = await this.parseService.parsePdf(file.filepath);
      if (contents == null) break;
      const fileResults = await this.service.search(contents, terms, fileId);
      results = [...results, ...fileResults];
    }

    const search = new Search();
    search.files = searchRequest.files;
    search.terms = terms;
    search.results = results;
    search.userId = userId;
    return await this.service.saveSearch(search);
  }

  // Performs a search with the received SearchRequest-object
  // Not used anymore? Remove? --Tuomo
  @Post('/search')
  @ApiOperation({ summary: 'Performs a search with the SearchRequest-object given in the body' })
  @ApiOkResponse({ status: 200, description: 'Search completed', type: SearchRequest })
  @UsePipes(new ValidationPipe({ transform: true }))
  async valueSearch(
    @Body() searchRequest: SearchRequest,
    @Req() request: Request,
  ): Promise<Search> {
    const search = new Search();
    search.files = searchRequest.files;
    search.terms = searchRequest.terms;
    search.results = [];
    const userId = request.user['_id'].toString();
    for (let i = 0; i < searchRequest.files.length; ++i) {
      const fileId = searchRequest.files[i];
      const file = await this.fileService.getFileMeta(fileId, userId);
      const contents = await this.parseService.parsePdf(file.filepath);
      if (contents == null) break;
      const results = await this.service.search(contents, search.terms, fileId);
      search.results = [...search.results, ...results];
    }

    return search;
  }

  @Get('/')
  @ApiOperation({ summary: 'Returns an array of all searches performed by current user' })
  @ApiOkResponse({ description: 'Searches retrieved successfully', type: [Search] })
  @ApiBadRequestResponse({ description: 'Invalid or missing request parameters' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  async getSearches(@Req() req: Request) {
    if (!req.user) throw new UnauthorizedException('User is not logged in');
    return await this.service.getSearchesByUserId(req.user['_id']);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Deletes a search record with given id' })
  @ApiOkResponse({ description: 'Search record deleted succesfully', type: Boolean })
  @ApiBadRequestResponse({ description: 'Invalid request parameters' })
  @ApiNotFoundResponse({ description: 'Resource not found' })
  @ApiUnauthorizedResponse({ description: 'User is not authenticated' })
  @ApiForbiddenResponse({ description: 'Access to resource is forbidden (user is not author)' })
  async deleteTemplate(@Param('id') id: string, @Req() req: Request): Promise<boolean> {
    if (!req.user) throw new UnauthorizedException('User is not logged in');
    if (!id) throw new BadRequestException('ID is not defined');
    return await this.service.deleteSearch(id, req.user['_id']);
  }
}
