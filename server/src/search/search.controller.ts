import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiBadRequestResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotAcceptableResponse, ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiCreatedResponse({ status: 201, description: "Search completed.", type: Search })
  @ApiNoContentResponse({ status: 204, description: "No content in PDF. PDF found and extracted, but no text in it could be found."})
  @ApiBadRequestResponse({status: 400, description: "File found, but it's not in PDF format. Make sure file ending is .pdf"})
  @ApiNotFoundResponse({status: 404, description: "File not found. Make sure the file name is correct and file exists."})
  async search(@Body() search: Search, @Param('file') file: string): Promise<Result[]> {
    const contents = await this.parseService.parsePdf(`test_pdfs/${file}`);
    if(contents == null) return null;
    return await this.service.search(contents, search);
  }
}
