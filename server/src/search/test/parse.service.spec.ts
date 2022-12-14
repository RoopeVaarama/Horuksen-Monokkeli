import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { ParseService } from '../parse.service';
import { invoicePdfExpectedResult } from './json/invoice.pdf';

describe('ParseService', () => {
  let parseService: ParseService;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [ParseService],
    }).compile();

    parseService = app.get<ParseService>(ParseService);
  });

  describe('Parsing document', () => {
    it('Should return info of valid PDF file', async () => {
      const invoicePath = `${__dirname}/files/invoice.pdf`;
      const results = await parseService.parsePdf(invoicePath);

      expect(results.meta.info).toEqual(invoicePdfExpectedResult.meta.info);
      expect(results.pages).toEqual(invoicePdfExpectedResult.pages);
    });

    it('Should return HttpException on invalid PDF file', async () => {
      const invoicePath = `${__dirname}/files/header.png`;
      const promise = parseService.parsePdf(invoicePath);
      await expect(promise).rejects.toThrow(HttpException);
      await expect(promise).rejects.toThrow("it's not in PDF format");
    });

    it('Should return HttpException if file not found', async () => {
      const invoicePath = `${__dirname}/files/fileNotFoundTest.pdf`;
      const promise = parseService.parsePdf(invoicePath);
      await expect(promise).rejects.toThrow(HttpException);
      await expect(promise).rejects.toThrow('File not found.');
    });

    it('Should return HttpException if PDF has no text elements', async () => {
      const invoicePath = `${__dirname}/files/images_1.pdf`;
      const promise = parseService.parsePdf(invoicePath);
      await expect(promise).rejects.toThrow(HttpException);
      await expect(promise).rejects.toThrow('No content in PDF.');
    });
  });
});
