import { ApiBadRequestResponse, ApiCreatedResponse, ApiNoContentResponse, ApiNotAcceptableResponse, ApiNotFoundResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Param, ValidationPipe, UsePipes } from '@nestjs/common';
import { ParseService } from './parse.service';
import { SearchService } from './search.service';
import { PDFExtractResult } from 'pdf.js-extract';
import { Terms } from './schemas/terms.schema';
import { Result } from './schemas/result.schema';
import { ValueSearch } from './schemas/valueSearch.schema';
import { TemplateService } from './template.service';

@Controller('search')
export class SearchController {
    constructor(
        private readonly service: SearchService,
        private readonly parseService: ParseService,
        private readonly templateService: TemplateService
    ) { }

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
    @Get('/valuesearch/:tid')
    @ApiCreatedResponse({ status: 200, description: 'Search completed', type: ValueSearch })
    async valueSearch(@Param('tid') tid: string): Promise<Result[]> {
        const contents = await this.parseService.parsePdf(`test_pdfs/invoice.pdf`);
        if (contents == null) return null;
        const search = await this.templateService.getTemplate(tid);
        return await this.service.search(contents, search.terms);
    }

    // create a new search template
    @Post('/create')
    @ApiCreatedResponse({ status: 200, description: 'Template created', type: ValueSearch })
    @UsePipes(new ValidationPipe({ transform: true }))
    async newTemplate(@Body() search: ValueSearch): Promise<ValueSearch> {
        return await this.templateService.createTemplate(search);
    }

    // returns all templates of a user
    @Get('/templates/:uid')
    @ApiCreatedResponse({ status: 200, description: 'Templates of user fetched', type: [ValueSearch] })
    async getTemplates(@Param('uid') uid: string): Promise<ValueSearch[]> {
        return await this.templateService.getTemplates(uid);
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
