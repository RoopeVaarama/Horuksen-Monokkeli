import { Injectable } from '@nestjs/common';
import {
  PDFExtract,
  PDFExtractOptions,
  PDFExtractPage,
  PDFExtractResult,
  PDFExtractText,
} from 'pdf.js-extract';
import { Result } from './schemas/result.schema';
import { Term } from '../template/schemas/term.schema';

enum Direction {
  Right,
  Below,
  Left,
  Above,
}

@Injectable()
export class SearchService {
  // Only finds exact matches
  async search(contents: PDFExtractResult, terms: Term[]): Promise<Result[]> {
    const pageArray = contents.pages;
    let pageIndex: number;
    let i: number;
    const results: Result[] = [];
    for (i = 0; i < terms.length; ++i) {
      for (pageIndex = 0; pageIndex < pageArray.length; ++pageIndex) {
        const page = pageArray[pageIndex];
        const contentArray = page.content;
        let ignore = terms[i].ignoreFirst;
        let max = terms[i].maxPerPage;
        if (terms[i].maxPerPage == 0) max = -1;
        let entryIndex: number;

        for (entryIndex = 0; entryIndex < contentArray.length; ++entryIndex) {
          const entry = contentArray[entryIndex];
          if (max == 0) break;
          if (this.keyMatch(terms[i].key, entry.str)) {
            if (ignore > 0) {
              --ignore;
              continue;
            }
            const result = new Result();
            result.file = contents.filename;
            result.page = pageIndex + 1;
            result.termIndex = i;
            result.key_x = entry.x;
            result.key_y = entry.y;
            result.key = terms[i].key;
            let res: PDFExtractText = null;
            if (!terms[i].keyOnly) res = this.findValue(terms[i], page, entry.x, entry.y);
            if (res != null) {
              result.value = res.str;
              result.val_x = res.x;
              result.val_y = res.y;
            }
            --max;
            results.push(result);
          }
        }
      }
    }
    return results;
  }

  // Returns the closest value in the desired direction within margin
  findValue(terms: Term, page: PDFExtractPage, key_x: number, key_y: number) {
    const contentArray = page.content;
    const candidates: PDFExtractText[] = [];
    let entryIndex: number;

    for (entryIndex = 0; entryIndex < contentArray.length; ++entryIndex) {
      const val = contentArray[entryIndex];
      if (val.str != ' ' && val.str != '') {
        switch (terms.direction) {
          case Direction.Right: {
            if (this.inMargin(val.y, key_y, terms.allowedOffset) && val.x > key_x)
              candidates.push(val);
            break;
          }
          case Direction.Below: {
            if (this.inMargin(val.x, key_x, terms.allowedOffset) && val.y > key_y)
              candidates.push(val);
            break;
          }
          case Direction.Left: {
            if (this.inMargin(val.y, key_y, terms.allowedOffset) && val.x < key_x)
              candidates.push(val);
            break;
          }
          case Direction.Above: {
            if (this.inMargin(val.x, key_x, terms.allowedOffset) && val.y < key_y)
              candidates.push(val);
            break;
          }
          default:
            break;
        }
      }
    }
    if (
      (terms.direction == Direction.Right || terms.direction == Direction.Left) &&
      candidates.length > 0
    )
      return this.closestOnX(key_x, candidates, terms);
    if (
      (terms.direction == Direction.Above || terms.direction == Direction.Below) &&
      candidates.length > 0
    )
      return this.closestOnY(key_y, candidates, terms);
    return null;
  }

  inMargin(val: number, key: number, margin: number) {
    return val >= key - margin && val <= key + margin;
  }

  closestOnX(x: number, values: PDFExtractText[], terms: Term) {
    let i: number;
    let match: boolean = false;
    match = this.valueMatch(values[0].str, terms.valueMatch);
    let closest: PDFExtractText = values[0];
    for (i = 1; i < values.length; ++i) {
      if (
        (Math.abs(x - values[i].x) < Math.abs(x - closest.x) || !match) &&
        this.valueMatch(values[i].str, terms.valueMatch)
      ) {
        closest = values[i];
        match = true;
      }
    }
    if (match) return closest;
    return null;
  }

  closestOnY(y: number, values: PDFExtractText[], terms: Term) {
    let i: number;
    let match: boolean = false;
    match = this.valueMatch(values[0].str, terms.valueMatch);
    let closest: PDFExtractText = values[0];
    for (i = 1; i < values.length; ++i) {
      if (
        (Math.abs(y - values[i].y) < Math.abs(y - closest.y) || !match) &&
        this.valueMatch(values[i].str, terms.valueMatch)
      ) {
        closest = values[i];
        match = true;
      }
    }
    if (match) return closest;
    return null;
  }

  // TODO some partial match logic for keys?
  keyMatch(key: string, entry: string) {
    return key == entry;
  }

  valueMatch(value: string, regex: string): boolean {
    const reg = new RegExp(regex);
    return reg.test(value);
  }
}
