import { Test, TestingModule } from '@nestjs/testing';
import { TemplateController } from '../template.controller';
import { TemplateService } from '../template.service';
import { TemplateStub } from '../test/stubs/template.schema.stub';

describe('TemplateController', () => {
  let templateController: TemplateController;
  let templateService: TemplateService;

  // Setup testing environment before running any tests
  beforeAll(async () => {
    // Mocked service interface
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
        verifyAuthor: jest.fn((a, b) => {
          return a == 'some-id';
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

  describe('Template Controller Methods', () => {
    // Static mocked values
    const mockReq = {
      body: {},
      user: {
        username: 'tester',
        _id: 'test-user-id',
      },
    } as any;
    const mockReqNoUser = {
      body: {},
    } as any;
    const mockId = 'some-id';

    // createTemplate ==========================================================================================
    it('Should be using mocked services for testing', async () => {
      const nullStub = {
        title: null,
        author: null,
        terms: null,
      };
      const expectedCall = nullStub;
      expectedCall.author = mockReq.user._id;

      const spy = jest.spyOn(templateService, 'createTemplate');
      const createdTemplate = await templateController.createTemplate(nullStub, mockReq);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(expectedCall);
      expect(createdTemplate.title).toBe(TemplateStub().title); // Mocked should return same with any parameters
    });

    it('[create] Should call createTemplate & return created object', async () => {
      const expectedCall = TemplateStub();
      expectedCall.author = mockReq.user._id;

      const spy = jest.spyOn(templateService, 'createTemplate');
      const createdTemplate = await templateController.createTemplate(TemplateStub(), mockReq);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(expectedCall);
      expect(createdTemplate.title).toBe(TemplateStub().title);
      expect(createdTemplate.terms).toStrictEqual(TemplateStub().terms);
    });

    it('[create] Should throw BadRequest for missing template', async () => {
      const errMsg = 'Template is not defined';
      await expect(templateController.createTemplate(null, mockReq)).rejects.toThrow(errMsg);
    });

    it('[create] Should throw Unauthorized for missing req.user', async () => {
      const errMsg = 'User is not logged in';
      await expect(
        templateController.createTemplate(TemplateStub(), mockReqNoUser),
      ).rejects.toThrow(errMsg);
    });

    // getTemplates ==========================================================================================
    it('[get] Should call getTemplatesByUserId & return array of documents', async () => {
      const spy = jest.spyOn(templateService, 'getTemplatesByUserId');
      const getAll = await templateController.getTemplates(mockReq);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(mockReq.user._id);
      expect(getAll).toHaveLength(1);
      expect(getAll[0]).toStrictEqual(TemplateStub());
    });

    it('[get] Should throw Unauthorized for missing req.user', async () => {
      const errMsg = 'User is not logged in';
      await expect(templateController.getTemplates(mockReqNoUser)).rejects.toThrow(errMsg);
    });

    // getAllTemplates ==========================================================================================
    it('[getAll] Should call getAllTemplates & return array of documents', async () => {
      const spy = jest.spyOn(templateService, 'getAllTemplates');
      const getAll = await templateController.getAllTemplates(mockReq);
      expect(spy).toHaveBeenCalled();
      expect(getAll).toHaveLength(1);
      expect(getAll[0]).toStrictEqual(TemplateStub());
    });

    it('[getAll] Should throw Unauthorized for missing req.user', async () => {
      const errMsg = 'User is not logged in';
      await expect(templateController.getAllTemplates(mockReqNoUser)).rejects.toThrow(errMsg);
    });

    // DEPRECATED
    /* it('Should call getTemplatesByUserId & return array of documents', async () => {
      const someUid = 'some-uid';
      const spy = jest.spyOn(templateService, 'getTemplatesByUserId');
      const getByUid = await templateController.getTemplatesByUser(someUid);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(someUid);
      expect(getByUid).toHaveLength(1);
      expect(getByUid[0]).toStrictEqual(TemplateStub());
    }); */

    // getTemplateById ==========================================================================================
    it('[getById] Should call getTemplateById & return found document', async () => {
      const spy = jest.spyOn(templateService, 'getTemplateById');
      const getById = await templateController.getTemplateById(mockId, mockReq);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(mockId);
      expect(getById).toStrictEqual(TemplateStub());
    });

    it('[getById] Should throw Unauthorized for missing req.user', async () => {
      const errMsg = 'User is not logged in';
      await expect(templateController.getTemplateById(mockId, mockReqNoUser)).rejects.toThrow(
        errMsg,
      );
    });

    it('[getById] Should throw BadRequest for missing ID', async () => {
      const errMsg = 'ID is not defined';
      await expect(templateController.getTemplateById(null, mockReq)).rejects.toThrow(errMsg);
    });

    // updateTemplate ==========================================================================================
    it('[update] Should call updateTemplate & return updated document', async () => {
      const spy = jest.spyOn(templateService, 'updateTemplate');
      const spy2 = jest.spyOn(templateService, 'verifyAuthor');
      const updatedTemplate = await templateController.updateTemplate(
        mockId,
        TemplateStub(),
        mockReq,
      );
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls[0][0]).toBe(mockId);
      expect(spy.mock.calls[0][1]).toStrictEqual(TemplateStub());
      expect(spy2).toHaveBeenCalled();
      expect(spy2.mock.calls[0][0]).toBe(mockId);
      expect(spy2.mock.calls[0][1]).toStrictEqual(mockReq.user);
      expect(spy2.mock.results[0].value).toBeTruthy();
      expect(updatedTemplate).toStrictEqual(TemplateStub());
    });

    it('[update] Should throw Unauthorized for missing req.user', async () => {
      const errMsg = 'User is not logged in';
      await expect(
        templateController.updateTemplate(mockId, TemplateStub(), mockReqNoUser),
      ).rejects.toThrow(errMsg);
    });

    it('[update] Should throw BadRequest for missing Template', async () => {
      const errMsg = 'Template is not defined';
      await expect(templateController.updateTemplate(mockId, null, mockReq)).rejects.toThrow(
        errMsg,
      );
    });

    it('[update] Should throw BadRequest for missing ID', async () => {
      const errMsg = 'ID is not defined';
      await expect(
        templateController.updateTemplate(null, TemplateStub(), mockReq),
      ).rejects.toThrow(errMsg);
    });

    it('[update] Should throw BadRequest for missing ID', async () => {
      const otherId = 'other-id';
      const errMsg = 'Access forbidden';
      await expect(
        templateController.updateTemplate(otherId, TemplateStub(), mockReq),
      ).rejects.toThrow(errMsg);
    });

    // deleteTemplate ==========================================================================================
    it('[delete] Should call deleteTemplate & return boolean', async () => {
      const spy = jest.spyOn(templateService, 'deleteTemplate');
      const spy2 = jest.spyOn(templateService, 'verifyAuthor');
      const deletedTemplate = await templateController.deleteTemplate(mockId, mockReq);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(mockId);
      expect(spy2).toHaveBeenCalled();
      expect(spy2.mock.calls[0][0]).toBe(mockId);
      expect(spy2.mock.calls[0][1]).toStrictEqual(mockReq.user);
      expect(deletedTemplate).toBeTruthy();
    });

    it('[delete] Should throw Unauthorized for missing req.user', async () => {
      const errMsg = 'User is not logged in';
      await expect(templateController.deleteTemplate(mockId, mockReqNoUser)).rejects.toThrow(
        errMsg,
      );
    });

    it('[delete]Should throw BadRequest for missing ID', async () => {
      const errMsg = 'ID is not defined';
      await expect(templateController.deleteTemplate(null, mockReq)).rejects.toThrow(errMsg);
    });

    it('[delete] Should throw BadRequest for missing ID', async () => {
      const otherId = 'other-id';
      const errMsg = 'Access forbidden';
      await expect(templateController.deleteTemplate(otherId, mockReq)).rejects.toThrow(errMsg);
    });
  });
});
