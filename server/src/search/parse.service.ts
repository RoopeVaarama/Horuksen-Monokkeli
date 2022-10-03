import { Injectable } from '@nestjs/common';
import { PDFExtract, PDFExtractOptions, PDFExtractResult } from 'pdf.js-extract';

@Injectable()
export class ParseService {

    async parsePdf(file: string):Promise<PDFExtractResult> {
        const pdfExtract = new PDFExtract();
        const options: PDFExtractOptions = {};
        return await pdfExtract.extract(file, options);
    }
}