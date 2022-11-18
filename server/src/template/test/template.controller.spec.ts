import { Test, TestingModule } from '@nestjs/testing';
import { TemplateController } from '../template.controller';
import { TemplateService } from '../template.service';
import { Template, TemplateSchema } from '../schemas/template.schema';
import { TemplateStub } from '../test/stubs/template.schema.stub';

describe('TemplateController', () => {
  let templateController: TemplateController;
  let templateService: TemplateService;

  // Setup testing environment before running any tests
  beforeAll(async () => {
    const MockTemplateService = {
      provide: TemplateService,
      useFactory: () => ({
        createTemplate: jest.fn(() => {
          return TemplateStub();
        }),
        getAllTemplates: jest.fn(() => {
          return [TemplateStub()];
        }),
        getTemplatesByUserId: jest.fn(() => {
          return [TemplateStub()];
        }),
        getTemplateById: jest.fn(() => {
          return TemplateStub();
        }),
        updateTemplate: jest.fn(() => {
          return TemplateStub();
        }),
        deleteTemplate: jest.fn(() => {
          return true;
        }),
      }),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [TemplateController],
      providers: [TemplateService, MockTemplateService],
    }).compile();
    templateController = app.get<TemplateController>(TemplateController);
    templateService = app.get<TemplateService>(TemplateService);
  });

  describe('Create Template', () => {
    it('Should be using mocked services for testing', async () => {
      const spy = jest.spyOn(templateService, 'createTemplate');
      const createdTemplate = await templateController.createTemplate(null);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(null);
      expect(createdTemplate.title).toBe(TemplateStub().title); // Mocked should return stub given param null
    });

    it('Should call createTemplate & return modified created object', async () => {
      const spy = jest.spyOn(templateService, 'createTemplate');
      const createdTemplate = await templateController.createTemplate(TemplateStub());
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(TemplateStub());
      expect(createdTemplate.title).toBe(TemplateStub().title);
      expect(createdTemplate.author).toBe(TemplateStub().author);
      expect(createdTemplate.terms).toStrictEqual(TemplateStub().terms);
      expect(createdTemplate).toHaveProperty('_id'); // Controller adds property _id  before returning
    });

    it('Should call getAllTemplates & return array of documents', async () => {
      const spy = jest.spyOn(templateService, 'getAllTemplates');
      const getAll = await templateController.getTemplates();
      expect(spy).toHaveBeenCalled();
      expect(getAll).toHaveLength(1);
      expect(getAll[0]).toStrictEqual(TemplateStub());
    });

    it('Should call getTemplatesByUserId & return array of documents', async () => {
      const someUid = 'some-uid';
      const spy = jest.spyOn(templateService, 'getTemplatesByUserId');
      const getByUid = await templateController.getTemplatesByUser(someUid);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(someUid);
      expect(getByUid).toHaveLength(1);
      expect(getByUid[0]).toStrictEqual(TemplateStub());
    });

    it('Should call getTemplateById & return found document', async () => {
      // Note: Query related raised errors, like 404, are thrown and tested in services.
      const someId = 'some-id';
      const spy = jest.spyOn(templateService, 'getTemplateById');
      const getById = await templateController.getTemplateById(someId);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(someId);
      expect(getById).toStrictEqual(TemplateStub());
    });

    it('Should call updateTemplate & return updated document', async () => {
      const someId = 'some-id';
      const spy = jest.spyOn(templateService, 'updateTemplate');
      const updatedTemplate = await templateController.updateTemplate(someId, TemplateStub());
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls[0][0]).toBe(someId);
      expect(spy.mock.calls[0][1]).toStrictEqual(TemplateStub());
      expect(updatedTemplate).toStrictEqual(TemplateStub());
    });

    it('Should call deleteTemplate & return boolean', async () => {
      const someId = 'some-id';
      const spy = jest.spyOn(templateService, 'deleteTemplate');
      const deletedTemplate = await templateController.deleteTemplate(someId);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(someId);
      expect(deletedTemplate).toBeTruthy();
    });
  });
});
