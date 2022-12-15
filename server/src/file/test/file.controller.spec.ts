import { Test, TestingModule } from '@nestjs/testing';
import { FileController } from '../file.controller';
import { FileService } from '../file.service';
import { ListService } from '../list.service';
import { ParseService } from '../../search/parse.service';
import { FileMetaStub } from './stubs/filemeta.schema.stub';
import { FileListStub } from './stubs/filelist.schema.stub';
import { UnauthorizedException } from '@nestjs/common';

describe('FileController', () => {
  let fileController: FileController;
  let fileService: FileService;
  let listService: ListService;
  let parseService: ParseService;

  beforeAll(async () => {
    const MockFileService = {
      provide: FileService,
      useFactory: () => ({
        canFileBeFound: jest.fn((a) => {
          return true;
        }),
        getFileId: jest.fn(() => {
          return 'some-file';
        }),
        doesUserOwnFile: jest.fn((a, b) => {
          return a == 'test-user-id';
        }),
        createFileMeta: jest.fn(() => {
          return FileMetaStub();
        }),
        getFileMeta: jest.fn(() => {
          return FileMetaStub();
        }),
        getFiles: jest.fn(() => {
          return [FileMetaStub()];
        }),
        getFilesByIds: jest.fn(() => {
          return [FileMetaStub()];
        }),
        deleteFile: jest.fn(() => {
          return true;
        }),
      }),
    };

    const MockListService = {
      provide: ListService,
      useFactory: () => ({
        canListBeFound: jest.fn((a) => {
          return true;
        }),
        doesUserOwnFileList: jest.fn((a, b) => {
          return a == 'test-user-id';
        }),
        createFileList: jest.fn(() => {
          return FileListStub();
        }),
        addFilesToFileList: jest.fn(() => {
          return FileListStub();
        }),
        removeFilesFromFileList: jest.fn(() => {
          return FileListStub();
        }),
        updateFileList: jest.fn(() => {
          return FileListStub();
        }),
        getAll: jest.fn(() => {
          return [FileListStub()];
        }),
        getOne: jest.fn(() => {
          return FileListStub();
        }),
        deleteFileList: jest.fn(() => {
          return true;
        }),
      }),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [FileController],
      providers: [FileService, MockFileService, ListService, MockListService, ParseService],
    }).compile();
    fileController = app.get<FileController>(FileController);
    fileService = app.get<FileService>(FileService);
    listService = app.get<ListService>(ListService);
    parseService = app.get<ParseService>(ParseService);
  });

  describe('Controller methods', () => {
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

    // NOTE: No need to test 'read': Better tested in-browser

    // TODO: Tests for uploadFile

    it('[get] Should call getFiles with userid & return array', async () => {
      const spy = jest.spyOn(fileService, 'getFiles');
      const getAll = await fileController.getFiles(mockReq);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(mockReq.user._id);
      expect(getAll).toHaveLength(1);
      expect(getAll[0]).toStrictEqual(FileMetaStub());
    });

    it('[delete] Should call doesUserOwnFile & deleteFile, return boolean', async () => {
      const spy = jest.spyOn(fileService, 'deleteFile');
      const spy2 = jest.spyOn(fileService, 'doesUserOwnFile');
      const deleted = await fileController.deleteFile(mockId, mockReq);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(mockId);
      expect(spy2).toHaveBeenCalled();
      expect(spy2.mock.calls[0][0]).toBe(mockReq.user._id);
      expect(spy2.mock.calls[0][1]).toStrictEqual(mockId);
      expect(deleted).toBeTruthy();
    });

    it('[delete] Should throw Unauthorized for missing req.user', async () => {
      const badReq = {
        body: {},
        user: {
          username: 'tester',
          _id: 'other-user-id',
        },
      } as any;
      await expect(fileController.deleteFile(mockId, badReq)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('[post] createFileList', async () => {
      const spy = jest.spyOn(listService, 'createFileList');
      const spy2 = jest.spyOn(fileService, 'doesUserOwnFile');
      const created = await fileController.createFileList(FileListStub(), mockReq);
      expect(spy).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalled();
      expect(created).toStrictEqual(FileListStub());
    });

    it('[get] getAllLists', async () => {
      const spy = jest.spyOn(listService, 'getAll');
      const getAll = await fileController.getAllLists(mockReq);
      expect(spy).toHaveBeenCalled();
      expect(spy).toHaveBeenCalledWith(mockReq.user._id);
      expect(getAll).toHaveLength(1);
      expect(getAll[0]).toStrictEqual(FileListStub());
    });

    it('[get] getOneList', async () => {
      const spy = jest.spyOn(listService, 'getOne');
      const getOne = await fileController.getOneList(mockId, mockReq);
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls[0][0]).toBe(mockId);
      expect(spy.mock.calls[0][1]).toStrictEqual(mockReq.user._id);
      expect(getOne).toStrictEqual(FileListStub());
    });

    it('[patch] updateFileList', async () => {
      const spy = jest.spyOn(listService, 'updateFileList');
      const spy2 = jest.spyOn(fileService, 'doesUserOwnFile');
      const updated = await fileController.updateFileList(mockId, FileListStub(), mockReq);
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls[0][0]).toBe(mockId);
      expect(spy.mock.calls[0][1]).toStrictEqual(FileListStub());
      expect(spy2).toHaveBeenCalled();
      expect(updated).toStrictEqual(FileListStub());
    });

    it('[patch] updateFileList unauthorized', async () => {
      const badReq = {
        body: {},
        user: {
          username: 'tester',
          _id: 'other-user-id',
        },
      } as any;
      await expect(fileController.updateFileList(mockId, FileListStub(), badReq)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('[delete] deleteFileList', async () => {
      const spy = jest.spyOn(listService, 'deleteFileList');
      const deleted = await fileController.deleteFileList(mockId, mockReq);
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls[0][0]).toBe(mockId);
      expect(spy.mock.calls[0][1]).toBe(mockReq.user._id);
      expect(deleted).toBeTruthy();
    });

    it('[patch] addFilesToList', async () => {
      const mockFileIds = ['mock-file-id'];
      const spy = jest.spyOn(listService, 'addFilesToFileList');
      const spy2 = jest.spyOn(listService, 'doesUserOwnFileList');
      const spy3 = jest.spyOn(fileService, 'getFilesByIds');
      const updated = await fileController.addFilesTtoList(mockId, mockFileIds, mockReq);
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls[0][0]).toBe(mockId);
      expect(spy.mock.calls[0][1]).toStrictEqual([FileMetaStub()]);
      expect(spy2).toHaveBeenCalled();
      expect(spy3).toHaveBeenCalled();
      expect(spy3.mock.calls[0][0]).toStrictEqual(mockFileIds);
      expect(spy3.mock.calls[0][1]).toStrictEqual(mockReq.user._id);
      expect(updated).toStrictEqual(FileListStub());
    });

    it('[patch] addFilesToList unauthorized', async () => {
      const mockFileIds = ['mock-file-id'];
      const badReq = {
        body: {},
        user: {
          username: 'tester',
          _id: 'other-user-id',
        },
      } as any;
      await expect(fileController.addFilesTtoList(mockId, mockFileIds, badReq)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('[delete] deleteFilesFromFileList', async () => {
      const mockFileIds = ['mock-file-id'];
      const spy = jest.spyOn(listService, 'removeFilesFromFileList');
      const spy2 = jest.spyOn(listService, 'canListBeFound');
      const spy3 = jest.spyOn(fileService, 'getFilesByIds');
      const removed = await fileController.deleteFilesFromFileList(mockId, mockFileIds, mockReq);
      expect(spy).toHaveBeenCalled();
      expect(spy.mock.calls[0][0]).toBe(mockId);
      expect(spy.mock.calls[0][1]).toStrictEqual([FileMetaStub()]);
      expect(spy2).toHaveBeenCalled();
      expect(spy2).toHaveBeenCalledWith(mockId);
      expect(spy3).toHaveBeenCalled();
      expect(spy3.mock.calls[0][0]).toStrictEqual(mockFileIds);
      expect(spy3.mock.calls[0][1]).toStrictEqual(mockReq.user._id);
      expect(removed).toStrictEqual(FileListStub());
    });
  });
});
