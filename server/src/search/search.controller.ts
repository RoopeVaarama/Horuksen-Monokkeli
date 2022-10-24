import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotAcceptableResponse,
  ApiNotFoundResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, ValidationPipe, UsePipes } from '@nestjs/common';
import { ParseService } from './parse.service';
import { SearchService } from './search.service';
import { PDFExtractResult } from 'pdf.js-extract';
import { Terms } from './schemas/terms.schema';
import { Result } from './schemas/result.schema';
import { TemplateService } from '../template//template.service';
import { ValueSearch } from '../template/schemas/value-search.schema';
import { Search } from './schemas/search.schema';
import { SearchRequest } from './schemas/search-request.schema';

@ApiTags('search')
@Controller('search')
export class SearchController {
  constructor(
    private readonly service: SearchService,
    private readonly parseService: ParseService,
    private readonly templateService: TemplateService,
  ) {}

  // extract the contents of a pdf
  @Get('/parse/:file')
  async parse(@Param('file') file: string): Promise<PDFExtractResult> {
    return await this.parseService.parsePdf(`test_pdfs/${file}`);
  }

  // old test endpoint, to be removed
  @Post('/test/:file')
  @ApiCreatedResponse({ status: 200, description: 'Search completed', type: ValueSearch })
  @UsePipes(ValidationPipe)
  async testSearch(@Body() search: ValueSearch, @Param('file') file: string): Promise<Result[]> {
    const contents = await this.parseService.parsePdf(`test_pdfs/${file}`);
    if (contents == null) return null;
    return await this.service.search(contents, search.terms);
  }

  // performs a search (currently just on Invoice.pdf) with the specified template id
  @Get('/templatesearch/:tid')
  @ApiCreatedResponse({ status: 200, description: 'Search completed', type: ValueSearch })
  async valueSearchWithId(@Param('tid') tid: string): Promise<Result[]> {
    const contents = await this.parseService.parsePdf(`test_pdfs/invoice.pdf`);
    if (contents == null) return null;
    const search = await this.templateService.getTemplate(tid);
    return await this.service.search(contents, search.terms);
  }

  // performs a search with the received SearchRequest-object
  @Post('/valuesearch')
  @ApiCreatedResponse({ status: 200, description: 'Search completed', type: SearchRequest })
  @UsePipes(new ValidationPipe({ transform: true }))
  async valueSearch(@Body() searchRequest: SearchRequest): Promise<Search> {
    const search = new Search();
    search.files = searchRequest.files;
    search.terms = searchRequest.terms;
    for (let i = 0; i < searchRequest.files.length; ++i) {
      const file = searchRequest.files[i];
      const contents = await this.parseService.parsePdf(`test_pdfs/${file}`);
      if (contents == null) break;
      const results = await this.service.search(contents, search.terms);
      search.results = [...search.results, ...results];
    }
    return search;
  }

  @Post(':file')
  @ApiCreatedResponse({ status: 201, description: 'Search completed.', type: ValueSearch })
  @ApiNoContentResponse({
    status: 204,
    description: 'No content in PDF. PDF found and extracted, but no text in it could be found.',
  })
  @ApiBadRequestResponse({
    status: 400,
    description: "File found, but it's not in PDF format. Make sure file ending is .pdf",
  })
  @ApiNotFoundResponse({
    status: 404,
    description: 'File not found. Make sure the file name is correct and file exists.',
  })
  async search(@Body() search: Terms, @Param('file') file: string): Promise<Result[]> {
    const contents = await this.parseService.parsePdf(`test_pdfs/${file}`);
    if (contents == null) return null;
    return await this.service.search(contents, search);
  }
}
