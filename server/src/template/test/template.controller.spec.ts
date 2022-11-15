import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model } from 'mongoose';
import { TemplateController } from '../template.controller';
import { TemplateService } from '../template.service';
import { Template, TemplateSchema } from '../schemas/template.schema';
import { TemplateStub } from '../test/stubs/template.schema.stub';
// import { Term, TermSchema } from '../schemas/term.schema';

describe('TemplateController', () => {
  let templateController: TemplateController;
  let templateService: TemplateService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let templateModel: Model<Template>;
  // let termModel: Model<Term>;

  // Setup testing environment before running any tests
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create(); // Create Mocked MongoDB memory server instance
    const uri = mongod.getUri(); // Get memory server instance URI
    mongoConnection = (await connect(uri)).connection; // Connect to memory server
    templateModel = mongoConnection.model(Template.name, TemplateSchema);
    // termModel = mongoConnection.model(Term.name, TermSchema);
    const app: TestingModule = await Test.createTestingModule({
      controllers: [TemplateController],
      providers: [
        TemplateService,
        { provide: getModelToken(Template.name), useValue: templateModel },
      ],
    }).compile();
    templateController = app.get<TemplateController>(TemplateController);
    templateService = app.get<TemplateService>(TemplateService);
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
    it('Should call create with & return saved object', async () => {
      const spy = jest.spyOn(templateService, 'createTemplate'); // No need to mock when using actual service
      const createdTemplate = await templateController.createTemplate(TemplateStub());
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(TemplateStub());
      expect(createdTemplate.title).toBe(TemplateStub().title);
    });

    it('Should return array of all documents', async () => {
      const spy = jest.spyOn(templateService, 'getAllTemplates');
      await templateController.createTemplate(TemplateStub()); // Populate DB
      const getAll = await templateController.getTemplates();
      expect(spy).toHaveBeenCalled();
      expect(getAll).toHaveLength(1);
      expect(getAll[0].title).toBe(TemplateStub().title);
      expect(getAll[0]).toHaveProperty('_id');
    });
  });
});
