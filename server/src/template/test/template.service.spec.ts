import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model, Types } from 'mongoose';
import { TemplateService } from '../template.service';
import { Template, TemplateDocument, TemplateSchema } from '../schemas/template.schema';
import { TemplateStub, UpdatedTemplateStub } from '../test/stubs/template.schema.stub';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('TemplateController', () => {
  let templateService: TemplateService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let templateModel: Model<Template>;

  // Setup testing environment before running any tests
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create(); // Create Mocked MongoDB memory server instance
    const uri = mongod.getUri(); // Get memory server instance URI
    mongoConnection = (await connect(uri)).connection; // Connect to memory server
    templateModel = mongoConnection.model(Template.name, TemplateSchema);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TemplateService,
        { provide: getModelToken(Template.name), useValue: templateModel },
      ],
    }).compile();

    templateService = module.get<TemplateService>(TemplateService);
  });

  // Clean-up and close DB memory server after all tests
  afterAll(async () => {
    await mongoConnection.dropDatabase();
    await mongoConnection.close();
    await mongod.stop();
  });

  // Clear DB collections after each test
  afterEach(async () => {
    const collections = mongoConnection.collections;
    for (const key in collections) {
      const collection = collections[key];
      await collection.deleteMany({});
    }
  });

  describe('Create Template', () => {
    it('Should save & return new document', async () => {
      const createdTemplate = await templateService.createTemplate(TemplateStub());
      expect(createdTemplate.title).toBe(TemplateStub().title); // Check for param property
      expect(createdTemplate).toHaveProperty('_id'); // Check for generated property
    });

    it('Should throw ValidationError for missing required', async () => {
      const badStub = {
        title: 'Test Template',
        author: null,
        terms: null,
      };
      const errMsg = 'Template validation failed: terms: Path `terms` is required.';
      await expect(templateService.createTemplate(badStub)).rejects.toThrow(errMsg);
    });

    it('Should find & return all documents (empty + populated DB)', async () => {
      const getEmpty = await templateService.getAllTemplates();
      await templateService.createTemplate(TemplateStub()); // Populate DB
      const getAll = await templateService.getAllTemplates();
      expect(getEmpty).toHaveLength(0);
      expect(getAll).toHaveLength(1);
      expect(getAll[0].title).toBe(TemplateStub().title);
    });

    it('Should find and return document by ID', async () => {
      const created = (await templateService.createTemplate(TemplateStub())) as TemplateDocument;
      const getById = (await templateService.getTemplateById(created._id)) as TemplateDocument;
      expect(getById.title).toBe(created.title);
      expect(getById.author).toBe(created.author);
      expect(getById.terms).toHaveLength(created.terms.length);
      expect(JSON.stringify(getById._id)).toBe(JSON.stringify(created._id));
      expect(getById).toHaveProperty('createdAt');
      expect(getById).toHaveProperty('updatedAt');
    });

    it('Should update and return document by ID', async () => {
      const created = (await templateService.createTemplate(TemplateStub())) as TemplateDocument;
      const updated = (await templateService.updateTemplate(
        created._id,
        UpdatedTemplateStub(),
      )) as TemplateDocument;
      expect(updated.title).toBe(UpdatedTemplateStub().title);
      expect(JSON.stringify(updated._id)).toBe(JSON.stringify(created._id));
    });

    it('Should delete document by ID and return true', async () => {
      const created = (await templateService.createTemplate(TemplateStub())) as TemplateDocument;
      await expect(templateService.getTemplateById(created._id)).resolves.toBeTruthy();
    });

    it('getTemplateById Should throw BadRequest for Invalid ID', async () => {
      const errMsg = 'Invalid id';
      await expect(templateService.getTemplateById('abc')).rejects.toThrow(BadRequestException);
      await expect(templateService.getTemplateById('abc')).rejects.toThrow(errMsg);
    });

    it('getTemplateById Should throw NotFound for no matches', async () => {
      const errMsg = 'No template matching the id exists';
      const created = (await templateService.createTemplate(TemplateStub())) as TemplateDocument;
      await templateService.deleteTemplate(created._id);
      await expect(templateService.getTemplateById(created._id)).rejects.toThrow(NotFoundException);
      await expect(templateService.getTemplateById(created._id)).rejects.toThrow(errMsg);
    });

    it('updateTemplate Should throw BadRequest for Invalid ID', async () => {
      const errMsg = 'Invalid id';
      await expect(templateService.updateTemplate('abc', TemplateStub())).rejects.toThrow(
        BadRequestException,
      );
      await expect(templateService.updateTemplate('abc', TemplateStub())).rejects.toThrow(errMsg);
    });

    it('updateTemplate Should throw NotFound for no matches', async () => {
      const errMsg = 'No template matching the id exists';
      const created = (await templateService.createTemplate(TemplateStub())) as TemplateDocument;
      await templateService.deleteTemplate(created._id);
      await expect(templateService.updateTemplate(created._id, TemplateStub())).rejects.toThrow(
        NotFoundException,
      );
      await expect(templateService.updateTemplate(created._id, TemplateStub())).rejects.toThrow(
        errMsg,
      );
    });
    it('deleteTemplate Should throw BadRequest for Invalid ID', async () => {
      const errMsg = 'Invalid id';
      await expect(templateService.deleteTemplate('abc')).rejects.toThrow(BadRequestException);
      await expect(templateService.deleteTemplate('abc')).rejects.toThrow(errMsg);
    });

    it('deleteTemplate Should throw NotFound for no matches', async () => {
      const errMsg = 'No template matching the id exists';
      const created = (await templateService.createTemplate(TemplateStub())) as TemplateDocument;
      await templateService.deleteTemplate(created._id);
      await expect(templateService.deleteTemplate(created._id)).rejects.toThrow(NotFoundException);
      await expect(templateService.deleteTemplate(created._id)).rejects.toThrow(errMsg);
    });

    // TODO: Get by UID, unless method is retired
  });
});
