import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, ValidationPipe, UsePipes } from '@nestjs/common';
import { ParseService } from './parse.service';
import { SearchService } from './search.service';
import { PDFExtractResult } from 'pdf.js-extract';
import { Result } from './schemas/result.schema';
import { TemplateService } from '../template//template.service';
import { Template } from '../template/schemas/template.schema';
import { Search } from './schemas/search.schema';
import { SearchRequest } from './schemas/search-request.schema';
import { FileService } from '../file/file.service';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(
    private readonly service: SearchService,
    private readonly parseService: ParseService,
    private readonly templateService: TemplateService,
    private readonly fileService: FileService,
  ) {}

  // extract the contents of a pdf
  @Get('/parse/:file')
  async parse(@Param('file') file: string): Promise<PDFExtractResult> {
    return await this.parseService.parsePdf(`test_pdfs/${file}`);
  }

  // Search with template id and a string array of file id's
  @Post('/template_search/:tid')
  @ApiCreatedResponse({ status: 200, description: 'Search completed', type: Template })
  async multifileSearchWithId(@Body() files: string[], @Param('tid') tid: string): Promise<Search> {
    const template = await this.templateService.getTemplateById(tid);
    let results: Result[] = [];
    for (let i = 0; i < files.length; ++i) {
      const fileId = files[i];
      const file = await this.fileService.getFileMeta(fileId);
      const contents = await this.parseService.parsePdf(file.filepath);
      if (contents == null) break;
      const fileResults = await this.service.search(contents, template.terms, fileId);
      results = [...results, ...fileResults];
    }
    const search = new Search();
    search.files = files;
    search.terms = template.terms;
    search.results = results;
    return search;
  }

  // Performs a search with the received SearchRequest-object
  @Post('/search')
  @ApiCreatedResponse({ status: 200, description: 'Search completed', type: SearchRequest })
  @UsePipes(new ValidationPipe({ transform: true }))
  async valueSearch(@Body() searchRequest: SearchRequest): Promise<Search> {
    const search = new Search();
    search.files = searchRequest.files;
    search.terms = searchRequest.terms;
    search.results = [];
    for (let i = 0; i < searchRequest.files.length; ++i) {
      const fileId = searchRequest.files[i];
      const file = await this.fileService.getFileMeta(fileId);
      const contents = await this.parseService.parsePdf(file.filepath);
      if (contents == null) break;
      const results = await this.service.search(contents, search.terms, fileId);
      search.results = [...search.results, ...results];
    }
    return search;
  }
}
