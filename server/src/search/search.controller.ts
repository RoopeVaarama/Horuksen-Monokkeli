import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParseService } from './parse.service';
import { SearchService } from './search.service';
import { PDFExtractResult, PDFExtract } from 'pdf.js-extract';
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
    this.checkFileValidity(file);
    //TODO: maybe put this to variable and use that instead of
    //extracting again in checkFileValidity
    return await this.parseService.parsePdf(`test_pdfs/${file}`);
  }

  @Post(':file')
  @ApiCreatedResponse({ status: 200, description: 'Search completed', type: Search })
  async findValues(@Body() search: Search, @Param('file') file: string): Promise<Result[]> {
    const contents = await this.parseService.parsePdf(`test_pdfs/${file}`);
    return await this.service.search(contents, search);
  }

  private checkFileValidity(file) {
    const PDFExtract = require('pdf.js-extract').PDFExtract;
    const pdfExtract = new PDFExtract();
    const options = {};
    pdfExtract.extract(`test_pdfs/${file}`, options, (err, data) => {
      if (err) return console.log(err);
      const page = data.pages[0];
      const lines = PDFExtract.utils.pageToLines(page, 2);
      const rows = PDFExtract.utils.extractTextRows(lines);
      //console.log("Lines: ", lines, " Rows: ", rows);
      if(rows == 0){
        //TODO: replace with something else
        console.log("This document seems to have no text. Are you sure you want to use this file?")
      }
    });
  }
}
