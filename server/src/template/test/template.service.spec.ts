import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model, Types } from 'mongoose';
import { TemplateService } from '../template.service';
import { Template, TemplateDocument, TemplateSchema } from '../schemas/template.schema';
import { TemplateStub, UpdatedTemplateStub } from '../test/stubs/template.schema.stub';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from '../../user/user.schema';

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

  describe('Template Service Methods', () => {
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
      await expect(templateService.deleteTemplate(created._id)).resolves.toBeTruthy();
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

    it('Should find and return documents by userID', async () => {
      const user = {
        _id: new Types.ObjectId('6380c7d7ca85580f1d5b69eb'),
      } as any;
      const stubWithUser = TemplateStub();
      stubWithUser.author = user._id;
      const created = (await templateService.createTemplate(stubWithUser)) as TemplateDocument;
      const getByUid = (await templateService.getTemplatesByUserId(user._id)) as TemplateDocument[];
      expect(getByUid).toHaveLength(1);
      expect(getByUid[0].title).toBe(created.title);
      expect(JSON.stringify(getByUid[0].author)).toBe(JSON.stringify(created.author));
      expect(getByUid[0].terms).toHaveLength(created.terms.length);
      expect(JSON.stringify(getByUid[0]._id)).toBe(JSON.stringify(created._id));
      expect(getByUid[0]).toHaveProperty('createdAt');
      expect(getByUid[0]).toHaveProperty('updatedAt');
    });

    it('getTemplateByUserId Should throw BadRequest for Invalid userID', async () => {
      const errMsg = 'Invalid user id';
      await expect(templateService.getTemplatesByUserId('abc')).rejects.toThrow(
        BadRequestException,
      );
      await expect(templateService.getTemplatesByUserId('abc')).rejects.toThrow(errMsg);
    });

    it('getTemplateByUserId Should throw NotFound for no matches', async () => {
      const user = {
        _id: new Types.ObjectId('6380c7d7ca85580f1d5b69eb'),
      } as any;
      const errMsg = 'No templates matching the user id exist';
      const created = (await templateService.createTemplate(TemplateStub())) as TemplateDocument;
      await templateService.deleteTemplate(created._id);
      await expect(templateService.getTemplatesByUserId(user._id)).rejects.toThrow(
        NotFoundException,
      );
      await expect(templateService.getTemplatesByUserId(user._id)).rejects.toThrow(errMsg);
    });

    it('verifyAuthor should return true', async () => {
      const user = {
        _id: new Types.ObjectId('6380c7d7ca85580f1d5b69eb'),
      } as any;
      const stubWithUser = TemplateStub();
      stubWithUser.author = user._id;
      const created = (await templateService.createTemplate(stubWithUser)) as TemplateDocument;
      const verify = await templateService.verifyAuthor(created._id, user._id);
      expect(verify).toBeTruthy();
    });

    it('verifyAuthor should return false', async () => {
      const user = {
        _id: new Types.ObjectId('6380c7d7ca85580f1d5b69eb'),
      } as any;
      const user2 = {
        _id: new Types.ObjectId('6280c7d7ca85580f1d5b69eb'),
      } as any;
      const stubWithUser = TemplateStub();
      stubWithUser.author = user._id;
      const created = (await templateService.createTemplate(stubWithUser)) as TemplateDocument;
      const verify = await templateService.verifyAuthor(created._id, user2._id);
      expect(verify).toBeFalsy();
    });

    it('verifyAuthor should throw NotFound for no matching template', async () => {
      const user = {
        _id: new Types.ObjectId('6380c7d7ca85580f1d5b69eb'),
      } as any;
      const errMsg = 'No template matching the id exists';
      const created = (await templateService.createTemplate(TemplateStub())) as TemplateDocument;
      await templateService.deleteTemplate(created._id);
      await expect(templateService.verifyAuthor(created._id, user._id)).rejects.toThrow(
        NotFoundException,
      );
      await expect(templateService.verifyAuthor(created._id, user._id)).rejects.toThrow(errMsg);
    });

    it('verifyAuthor should throw BadRequest for bad id', async () => {
      const uid = new Types.ObjectId('6380c7d7ca85580f1d5b69eb');
      const errMsg = 'Invalid id';
      await expect(templateService.verifyAuthor(null, uid)).rejects.toThrow(BadRequestException);
      await expect(templateService.verifyAuthor(null, uid)).rejects.toThrow(errMsg);
    });

    it('verifyAuthor should throw BadRequest for bad user id', async () => {
      const id = new Types.ObjectId('6280c7d7ca85580f1d5b69eb');
      const errMsg = 'Invalid user id';
      await expect(templateService.verifyAuthor(id, null)).rejects.toThrow(BadRequestException);
      await expect(templateService.verifyAuthor(id, null)).rejects.toThrow(errMsg);
    });
  });
});
