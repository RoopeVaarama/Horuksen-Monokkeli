import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BadRequestException, HttpException, NotFoundException } from '@nestjs/common';
import { ParseService } from '../parse.service';
import { invoicePdfExpectedResult } from './json/invoice.pdf';
import { Direction, SearchService } from '../search.service';
import { Term } from 'src/template/schemas/term.schema';
import { mockPage1 } from './json/mockPages';
import { Search, SearchDocument, SearchSchema } from '../schemas/search.schema';
import { connect, Connection, Model } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('SearchService', () => {
  let searchService: SearchService;
  let searchModel: Model<Search>;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create(); // Create Mocked MongoDB memory server instance
    const uri = mongod.getUri(); // Get memory server instance URI
    mongoConnection = (await connect(uri)).connection; // Connect to memory server
    searchModel = mongoConnection.model(Search.name, SearchSchema);

    const app: TestingModule = await Test.createTestingModule({
      providers: [SearchService, { provide: getModelToken(Search.name), useValue: searchModel }],
    }).compile();

    searchService = app.get<SearchService>(SearchService);
  });

  // Clean-up and close DB memory server after all tests
  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  const termTemplate: Term = {
    key: '',
    keyOnly: false,
    levenDistance: 0,
    direction: 0,
    allowedOffset: 10,
    valueMatch: '.*',
    valuePrune: '.*',
    ignoreFirst: 0,
    maxPerPage: 0,
  };

  describe('Utility functions', () => {
    describe('findValue', () => {
      const findValueTerm: Term = {
        ...termTemplate,
        key: 'Text 1',
        direction: Direction.Right,
      };

      it('Should find element on the right side of the key', () => {
        const value = searchService.findValue(
          findValueTerm,
          mockPage1,
          mockPage1.content[0].x,
          mockPage1.content[0].y,
        );

        expect(value.str).toEqual(mockPage1.content[1].str);
      });

      it('Should find element below the key', () => {
        findValueTerm.direction = Direction.Below;

        const value = searchService.findValue(
          findValueTerm,
          mockPage1,
          mockPage1.content[0].x,
          mockPage1.content[0].y,
        );

        expect(value.str).toEqual(mockPage1.content[3].str);
      });

      it('Should correctly find value with valid regex ending in 3', () => {
        findValueTerm.direction = Direction.Right;
        findValueTerm.valueMatch = '(.+)3';

        const value = searchService.findValue(
          findValueTerm,
          mockPage1,
          mockPage1.content[0].x,
          mockPage1.content[0].y,
        );

        expect(value.str).toEqual(mockPage1.content[2].str);
      });

      it('Should not find values if regex matched no elements', () => {
        findValueTerm.valueMatch = 'InvalidRegexPattern';

        const value = searchService.findValue(
          findValueTerm,
          mockPage1,
          mockPage1.content[0].x,
          mockPage1.content[0].y,
        );

        expect(value).toBeNull();
      });
    });

    describe('inMargin', () => {
      it('Should return true if within given margin', () => {
        expect(searchService.inMargin(15, 10, 10)).toEqual(true);
        expect(searchService.inMargin(5, 10, 10)).toEqual(true);
      });

      it('Should return false if not within given margin', () => {
        expect(searchService.inMargin(21, 10, 10)).toEqual(false);
        expect(searchService.inMargin(-1, 10, 10)).toEqual(false);
      });
    });

    describe('closestOn', () => {
      it('closestOnX should return closest element to give X-coordinate', () => {
        const value = searchService.closestOnX(75, mockPage1.content, termTemplate);
        expect(value).toEqual(mockPage1.content[1]);
      });
      it('closestOnY should return closest element to give X-coordinate', () => {
        const value = searchService.closestOnY(75, mockPage1.content, termTemplate);
        expect(value).toEqual(mockPage1.content[4]);
      });
    });

    describe('keyMatch', () => {
      it('Should return true on exact match', () => {
        const value = searchService.keyMatch('Test', 'Test', 0);
        expect(value).toEqual(true);
      });

      it('Should return false on no match', () => {
        const value = searchService.keyMatch('Test', 'Test', 0);
        expect(value).toEqual(true);
      });

      it('Should return true if value is within given Levenshtein distance of key', () => {
        let value = searchService.keyMatch('Testong', 'Testing', 1);
        expect(value).toEqual(true);

        value = searchService.keyMatch('Test', 'Testing', 3);
        expect(value).toEqual(true);
      });
    });

    describe('pruneValue', () => {
      it('Should return value excluding given prune value', () => {
        const value = searchService.pruneValue('Test123', 'Test');
        expect(value).toEqual('123');
      });
    });
  });
});
