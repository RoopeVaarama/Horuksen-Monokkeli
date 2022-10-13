import { Injectable } from '@nestjs/common';
import { PDFExtract, PDFExtractOptions, PDFExtractPage, PDFExtractResult, PDFExtractText } from 'pdf.js-extract';
import { Result } from './schemas/result.schema';
import { Search } from './schemas/search.schema';


enum Direction { Right, Below, Left, Above }

// Hardcoded allowed offset on axis for now, maybe include in search?
const margin = 5;

@Injectable()
export class SearchService {

    // Only finds exact matches
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
                if (this.keyMatch(search.key, entry.str)) {
                    let result = new Result();
                    result.page = pageIndex + 1;
                    result.key_x = entry.x;
                    result.key_y = entry.y;
                    result.key = search.key;
                    if (!search.findValues) result.value = null
                    else {
                        let res = this.findValue(search, page, entry.x, entry.y);
                        if (res != null) {
                            result.value = res.str;
                            result.val_x = res.x;
                            result.val_y = res.y;
                        }

                    }
                    results.push(result);
                }
            }
        }
        return results;
    }

    // Returns the closest value in the desired direction within margin
    findValue(search: Search, page: PDFExtractPage, key_x: number, key_y: number) {
        const contentArray = page.content;
        let entryIndex: number;
        let candidates: PDFExtractText[] = [];

        for (entryIndex = 0; entryIndex < contentArray.length; ++entryIndex) {
            let val = contentArray[entryIndex];
            if (val.str != ' ' && val.str != '') {
                switch (search.direction) {
                    case Direction.Right: {
                        if (this.inMargin(val.y, key_y) && val.x > key_x)
                            candidates.push(val);
                        break;
                    }
                    case Direction.Below: {
                        if (this.inMargin(val.x, key_x) && val.y > key_y)
                            candidates.push(val);
                        break;
                    }
                    case Direction.Left: {
                        if (this.inMargin(val.y, key_y) && val.x < key_x)
                            candidates.push(val);
                        break;
                    }
                    case Direction.Above: {
                        if (this.inMargin(val.x, key_x) && val.y < key_y)
                            candidates.push(val);
                        break;
                    }
                    default: break;
                }
            }
        }
        if ((search.direction == Direction.Right || search.direction == Direction.Left) && candidates.length > 0)
            return this.closestOnX(key_x, candidates);
        if ((search.direction == Direction.Above || search.direction == Direction.Below) && candidates.length > 0)
            return this.closestOnY(key_y, candidates);
        return null;
    }

    inMargin(val: number, key: number) {
        return val >= key - margin && val <= key + margin;
    }

    closestOnX(x: number, values: PDFExtractText[]) {
        let i: number;
        let closest: PDFExtractText = values[0];
        for (i = 1; i < values.length; ++i) {
            if (Math.abs(x - values[i].x) < Math.abs(x - closest.x)) closest = values[i];
        }
        return closest;
    }

    closestOnY(y: number, values: PDFExtractText[]) {
        let i: number;
        let closest: PDFExtractText = values[0];
        for (i = 1; i < values.length; ++i) {
            if (Math.abs(y - values[i].y) < Math.abs(y - closest.y)) closest = values[i];
        }
        return closest;
    }

    // TODO some partial match logic for keys?
    keyMatch(key: string, entry: string) {
        return key == entry;
    }

    // TODO value matching, regex?
    valueMatch(value: string, regex: string) {
        return true;
    }

}