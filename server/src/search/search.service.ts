import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import {
  PDFExtract,
  PDFExtractOptions,
  PDFExtractPage,
  PDFExtractResult,
  PDFExtractText,
} from 'pdf.js-extract';
import { Result } from './schemas/result.schema';
import { Term } from '../template/schemas/term.schema';
import { distance } from 'fastest-levenshtein';
import { Search, SearchDocument } from './schemas/search.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

export enum Direction {
  Right,
  Below,
  Left,
  Above,
}

// strings to be ignored in the pdf when looking for values
const ignoredValues: string[] = ['', ' '];

@Injectable()
export class SearchService {
  constructor(@InjectModel(Search.name) private searchModel: Model<SearchDocument>) {}

  // takes an array of search terms and a file id, returns all found results in a single array
  async search(contents: PDFExtractResult, terms: Term[], fileId: string): Promise<Result[]> {
    const pageArray = contents.pages;
    const results: Result[] = [];

    // for each object of terms, iterate through every page
    for (let i = 0; i < terms.length; ++i) {
      for (let pageIndex = 0; pageIndex < pageArray.length; ++pageIndex) {
        const page = pageArray[pageIndex];
        const contentArray = page.content;
        let ignore = terms[i].ignoreFirst;
        let max = terms[i].maxPerPage;
        if (terms[i].maxPerPage == 0) max = -1;
        if (ignore > 0) contentArray.sort((a: PDFExtractText, b: PDFExtractText) => a.y - b.y);

        // iterate through every entry on the page
        for (let entryIndex = 0; entryIndex < contentArray.length; ++entryIndex) {
          const entry = contentArray[entryIndex];
          const key = terms[i].key;

          // search for a key only
          if (terms[i].keyOnly) {
            if (this.containsKey(key, entry.str)) {
              results.push(this.createResult(entry, key, pageIndex, fileId, i));
            }
            continue;
          }

          // search for a key-value pair
          if (max == 0) break;
          if (this.keyMatch(key, entry.str, terms[i].levenDistance)) {
            if (ignore > 0) {
              --ignore;
              continue;
            }
            const result = this.createResult(entry, key, pageIndex, fileId, i);
            let value: PDFExtractText = null;
            value = this.findValue(terms[i], page, entry.x, entry.y);
            if (value != null) {
              result.value = this.pruneValue(value.str, terms[i].valuePrune);
              result.val_x = value.x;
              result.val_y = value.y;
              result.value_height = value.height;
              result.value_width = value.width;
            }
            --max;
            results.push(result);
          }
        }
      }
    }
    return results;
  }

  // returns the closest matching value in the desired direction within allowed offset
  findValue(terms: Term, page: PDFExtractPage, key_x: number, key_y: number) {
    const contentArray = page.content;
    const candidates: PDFExtractText[] = [];
    let entryIndex: number;

    for (entryIndex = 0; entryIndex < contentArray.length; ++entryIndex) {
      const val = contentArray[entryIndex];
      if (!ignoredValues.includes(val.str)) {
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

  // checks if a number is in given margin from another number
  inMargin(val: number, key: number, margin: number): boolean {
    return val >= key - margin && val <= key + margin;
  }

  // returns the closest match of given values on the x-axis
  closestOnX(x: number, values: PDFExtractText[], terms: Term): PDFExtractText {
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

  // returns the closest match of given values on the y-axis
  closestOnY(y: number, values: PDFExtractText[], terms: Term): PDFExtractText {
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

  // levenshtein key matching
  keyMatch(key: string, entry: string, leven: number) {
    if (leven == 0) return key == entry;
    if (Math.abs(key.length - entry.length) > leven) return false;
    if (distance(key, entry) > leven) return false;
    return true;
  }

  // checks if value matches regex
  valueMatch(value: string, regex: string): boolean {
    const reg = new RegExp(regex);
    return reg.test(value);
  }

  // check if entry contains key (case insensitive)
  containsKey(key: string, entry: string): boolean {
    return entry.toLowerCase().includes(key.toLowerCase());
  }

  // removes instances of prune-string from value-string
  pruneValue(value: string, prune: string): string {
    if (prune == '') return value;
    return value.replace(prune, '');
  }

  // returns a new Result-object with the given values
  createResult(entry: PDFExtractText, key: string, p: number, fid: string, i: number): Result {
    const result = new Result();
    result.file = fid;
    result.page = p + 1;
    result.termIndex = i;
    result.key_x = entry.x;
    result.key_y = entry.y;
    result.key = key;
    result.key_height = entry.height;
    result.key_width = entry.width;
    return result;
  }

  // DATABASE METHODS

  async saveSearch(search: Search): Promise<Search> {
    return await new this.searchModel(search).save();
  }

  async deleteSearch(id: string, uid: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid id');
    if (!Types.ObjectId.isValid(uid)) throw new BadRequestException('Invalid user id');
    const search = await this.searchModel.findById(id);
    if (!search) throw new NotFoundException('No template matching the id exists');
    if (search.userId != uid) throw new ForbiddenException('Access forbidden');
    const deleteRes = await this.searchModel.deleteOne({ _id: id }).exec();
    return deleteRes.acknowledged;
  }

  async getSearchesByUserId(uid: string): Promise<Search[]> {
    if (!Types.ObjectId.isValid(uid)) throw new BadRequestException('Invalid user id');
    const searches = await this.searchModel.find({ userId: uid }).exec();
    if (!searches.length) throw new NotFoundException('No searches done by the user found');
    return searches;
  }
}
