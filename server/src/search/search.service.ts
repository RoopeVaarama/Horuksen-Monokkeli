import { Injectable } from '@nestjs/common';
import { PDFExtract, PDFExtractOptions, PDFExtractPage, PDFExtractResult } from 'pdf.js-extract';
import { Result } from './schemas/result.schema';
import { Search } from './schemas/search.schema';

@Injectable()
export class SearchService {
	// only finds exact matches
	async search(contents: PDFExtractResult, search: Search): Promise<Result[]> {

		const pageArray = contents.pages;
		let pageIndex: number;
		const results: Result[] = [];

		for (pageIndex = 0; pageIndex < pageArray.length; ++pageIndex) {

			const page = pageArray[pageIndex];
			const contentArray = page.content;
			let entryIndex: number;

			for (entryIndex = 0; entryIndex < contentArray.length; ++entryIndex) {
				let entry = contentArray[entryIndex];
				if (entry.str == search.key) {
					const result = new Result();
					result.key = search.key;
					result.value = this.rightValue(page, entry.x, entry.y);
					results.push(result);
				}
			}
		}
		return results;
	}

	private rightValue(page: PDFExtractPage, x: number, y: number) {
		const contentArray = page.content;
		let entryIndex: number;

		for (entryIndex = 0; entryIndex < contentArray.length; ++entryIndex) {
			let entry = contentArray[entryIndex];
			if (entry.y == y && entry.x > x && entry.str != ' ') {
				return entry.str
			}
		}
		return 'no value found';
	}
}