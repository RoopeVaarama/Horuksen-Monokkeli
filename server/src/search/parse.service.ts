import { Injectable } from '@nestjs/common';
import { PDFExtract, PDFExtractOptions, PDFExtractResult } from 'pdf.js-extract';

@Injectable()
export class ParseService {

    async parsePdf(file: string): Promise<PDFExtractResult> {
        return await this.checkFileValidity(file);
    }

    checkFileValidity(file: string) {
        const PDFExtract = require('pdf.js-extract').PDFExtract;
        const pdfExtract = new PDFExtract();
        const options = {};
        let extractedPDF = pdfExtract.extract(`${file}`, options, (err, data) => {
            if (err){
                console.log(err);
                return null;
            }
            let linesInTotal = 0;
            for (let pageIndex = 0; pageIndex < data.pages.length; ++pageIndex) {
                const page = data.pages[pageIndex];
                const lines = PDFExtract.utils.pageToLines(page, 2);
                linesInTotal += lines;
            }

            if (linesInTotal == 0) {
                //TODO: replace with something else
                console.log("This document seems to have no text. Are you sure you want to use this file?")
            }
        });
        return extractedPDF;
    }
}