import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ParseService } from './parse.service';
import { SearchService } from './search.service';
import { PDFExtractResult } from 'pdf.js-extract';
import { Search } from './schemas/search.schema';
import { Result } from './schemas/result.schema';
    
@Controller('search')
export class SearchController {

    @Get('/parse/:file')
    async parse(@Param('file') file:string): Promise<PDFExtractResult> {
        return await new ParseService().parsePdf(`test_pdfs/${file}`);
    }

    @Post(':file')
    @ApiCreatedResponse({ status: 200, description: 'Search completed', type: Search })
    async findValues(@Body() search: Search, @Param('file') file: string): Promise<Result[]> {
        const contents = await new ParseService().parsePdf(`test_pdfs/${file}`);
        return await new SearchService().search(contents, search);
    }

}
