import { Injectable } from '@nestjs/common';
import { PDFExtract, PDFExtractOptions, PDFExtractResult } from 'pdf.js-extract';

@Injectable()
export class ParseService {

    async parsePdf(file: string): Promise<PDFExtractResult> {
        const pdfExtract = new PDFExtract();
        const options: PDFExtractOptions = {};
        let extractedPDF;
        try {
            extractedPDF = await pdfExtract.extract(file, options);
        }
        catch (err) {
            if (err.name == "InvalidPDFException") {
                console.log("File not in PDF format.");
            }
            else {
                console.log("Something went wrong when extracting PDF.")
            }
            return null;
        }

        if (this.doesDocumentHaveText(extractedPDF) == false) {
            //TODO: probably has to be replaced with call to frontend
            console.log("This document seems to have no text. Are you sure you want to use this file?")
        }


        return extractedPDF;
    }

    doesDocumentHaveText(data: PDFExtractResult) {
        let contentInTotal = 0;
        for (let pageIndex = 0; pageIndex < data.pages.length; ++pageIndex) {
            const page = data.pages[pageIndex];
            contentInTotal += page.content.length;
        }

        if (contentInTotal == 0) {
            return false;
        }
        return true;
    }
}