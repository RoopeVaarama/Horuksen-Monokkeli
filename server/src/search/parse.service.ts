import { Injectable } from '@nestjs/common';
import {
  PDFExtract,
  PDFExtractOptions,
  PDFExtractResult,
} from 'pdf.js-extract';
import { HttpException } from '@nestjs/common';

@Injectable()
export class ParseService {
  async parsePdf(file: string): Promise<PDFExtractResult> {
    const pdfExtract = new PDFExtract();
    const options: PDFExtractOptions = {};
    let extractedPDF;
    try {
      extractedPDF = await pdfExtract.extract(file, options);
    } catch (err) {
      if (err.name == 'InvalidPDFException') {
        throw new HttpException(
          "File found, but it's not in PDF format. " +
            'Make sure file ending is .pdf',
          400,
        );
      } else {
        throw new HttpException(
          'File not found. ' +
            'Make sure the file name is correct and file exists.',
          404,
        );
      }
      return null;
    }

    if (this.doesDocumentHaveText(extractedPDF) == false) {
      //TODO: this text not disaplayed in return message.
      //Return code still works fine.
      throw new HttpException(
        'No content in PDF. ' +
          'PDF found and extracted, but no text in it could be found.',
        204,
      );
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
