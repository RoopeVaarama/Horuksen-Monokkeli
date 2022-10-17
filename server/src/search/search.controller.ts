import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParseService } from './parse.service';
import { SearchService } from './search.service';
import { PDFExtractResult } from 'pdf.js-extract';
import { Search } from './schemas/search.schema';
import { Result } from './schemas/result.schema';

@Controller('search')
export class SearchController {
  constructor(
    private readonly service: SearchService,
    private readonly parseService: ParseService
  ) { }


  @Get('/parse/:file')
  async parse(@Param('file') file: string): Promise<PDFExtractResult> {
    return await this.parseService.parsePdf(`test_pdfs/${file}`);
  }

  @Post(':file')
  @ApiCreatedResponse({ status: 200, description: 'Search completed', type: Search })
  async search(@Body() search: Search, @Param('file') file: string): Promise<Result[]> {
    const contents = await this.parseService.parsePdf(`test_pdfs/${file}`);
    if(contents == null) return null;
    return await this.service.search(contents, search);
  }
}
