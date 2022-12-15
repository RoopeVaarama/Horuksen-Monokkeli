import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model, Types } from 'mongoose';
import { ListService } from '../list.service';
import { FileService } from '../file.service';
import { FileMeta, FileMetaDocument, FileMetaSchema } from '../schemas/filemeta.schema';
import { FileList, FileListDocument, FileListSchema } from '../schemas/filelist.schema';
import { FileListStub } from './stubs/filelist.schema.stub';
import { FileMetaStub, FileStub, FileStub2 } from '../test/stubs/filemeta.schema.stub';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

describe('ListServiceSpec', () => {
  let listService: ListService;
  let fileService: FileService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let fileListModel: Model<FileList>;
  let fileMetaModel: Model<FileMeta>;

  // Setup testing environment before running any tests
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create(); // Create Mocked MongoDB memory server instance
    const uri = mongod.getUri(); // Get memory server instance URI
    mongoConnection = (await connect(uri)).connection; // Connect to memory server
    fileMetaModel = mongoConnection.model(FileMeta.name, FileMetaSchema);
    fileListModel = mongoConnection.model(FileList.name, FileListSchema);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FileService,
        ListService,
        { provide: getModelToken(FileMeta.name), useValue: fileMetaModel },
        { provide: getModelToken(FileList.name), useValue: fileListModel },
      ],
    }).compile();

    fileService = module.get<FileService>(FileService);
    listService = module.get<ListService>(ListService);
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

  describe('List Service Methods', () => {
    const userStub = {
      _id: new Types.ObjectId('6380c7d7ca85580f1d5b69eb'),
    } as any;

    const userStub2 = {
      _id: new Types.ObjectId('6280c7d7ca85580f1d5b69eb'),
    } as any;

    const listStub = FileListStub() as any;
    listStub.author = userStub._id;
    listStub.files = [new Types.ObjectId('6180c7d7ca85580f1d5b69ea')];

    it('createFilList', async () => {
      const created = await listService.createFileList(listStub);
      expect(created.title).toBe(listStub.title); // Check for param property
      expect(created).toHaveProperty('_id'); // Check for generated property
    });

    it('getOne', async () => {
      const created = (await listService.createFileList(listStub)) as FileListDocument;
      const getOne = (await listService.getOne(created._id, created.author)) as FileListDocument;
      expect(getOne.title).toBe(created.title);
      expect(getOne.author).toBe(created.author);
      expect(JSON.stringify(getOne._id)).toBe(JSON.stringify(created._id));
    });

    it('getOne Unauthorized', async () => {
      const created = (await listService.createFileList(listStub)) as FileListDocument;
      await expect(listService.getOne(created._id, userStub2._id)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('getOne Empty', async () => {
      const created = (await listService.createFileList(listStub)) as FileListDocument;
      await listService.deleteFileList(created._id, created.author);
      await expect(listService.getOne(created._id, created.author)).resolves.toBeNull();
    });

    it('getAll empty & populated', async () => {
      const getEmpty = await listService.getAll(userStub2._id);
      await listService.createFileList(listStub); // Populate DB
      const getAll = await listService.getAll(userStub._id);
      expect(getEmpty).toHaveLength(0);
      expect(getAll).toHaveLength(1);
      expect(getAll[0].title).toBe(listStub.title);
    });

    it('updateFileList', async () => {
      const updatedListStub = FileListStub() as any;
      updatedListStub.title = 'new-title';
      updatedListStub.files = [new Types.ObjectId('6180c7d7ca85580f1d5b69ea')];
      const created = (await listService.createFileList(listStub)) as FileListDocument;
      const updated = (await listService.updateFileList(
        created._id,
        updatedListStub,
      )) as FileListDocument;
      expect(updated.title).toBe(updatedListStub.title);
      expect(JSON.stringify(updated._id)).toBe(JSON.stringify(created._id));
      expect(updated).toHaveProperty('updatedAt');
    });

    it('deleteFileList', async () => {
      const created = (await listService.createFileList(listStub)) as FileListDocument;
      await expect(listService.deleteFileList(created._id, created.author)).resolves.toBeTruthy();
    });

    it('deleteFileList Unauthorized', async () => {
      const created = (await listService.createFileList(listStub)) as FileListDocument;
      await expect(listService.deleteFileList(created._id, userStub2._id)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('addFilesToFileList', async () => {
      const newFile = (await fileService.createFileMeta(
        FileStub(),
        userStub._id,
      )) as FileMetaDocument;
      const newFile2 = (await fileService.createFileMeta(
        FileStub2(),
        userStub._id,
      )) as FileMetaDocument;
      const newListStub = FileListStub();
      newListStub.author = userStub._id;
      newListStub.files = [newFile._id];

      const created = (await listService.createFileList(newListStub)) as FileListDocument;
      const updated = (await listService.addFilesToFileList(created._id, [
        newFile2,
      ])) as FileListDocument;
      expect(created.files).toHaveLength(1);
      expect(updated.files).toHaveLength(2);
      expect(JSON.stringify(updated._id)).toBe(JSON.stringify(created._id));
    });

    it('removeFilesFromFileList', async () => {
      const newFile = (await fileService.createFileMeta(
        FileStub(),
        userStub._id,
      )) as FileMetaDocument;
      const newFile2 = (await fileService.createFileMeta(
        FileStub2(),
        userStub._id,
      )) as FileMetaDocument;
      const newListStub = FileListStub();
      newListStub.author = userStub._id;
      newListStub.files = [newFile._id, newFile2._id];

      const created = (await listService.createFileList(newListStub)) as FileListDocument;
      const updated = (await listService.removeFilesFromFileList(created._id, [
        newFile2,
      ])) as FileListDocument;
      expect(created.files).toHaveLength(2);
      expect(updated.files).toHaveLength(1);
      expect(JSON.stringify(updated._id)).toBe(JSON.stringify(created._id));
    });

    // Helper methods

    it('canListBeFound', async () => {
      const created = (await listService.createFileList(listStub)) as FileListDocument;
      await expect(listService.canListBeFound(created._id)).resolves.toBeTruthy();
    });

    it('canListBeFound NotFound', async () => {
      const created = (await listService.createFileList(listStub)) as FileListDocument;
      listService.deleteFileList(created._id, userStub._id);
      await expect(listService.canListBeFound(created._id)).rejects.toThrow(NotFoundException);
    });

    it('doesUserOwnFileList Owns', async () => {
      const created = (await listService.createFileList(listStub)) as FileListDocument;
      await expect(
        listService.doesUserOwnFileList(userStub._id, created._id),
      ).resolves.toBeTruthy();
    });

    it('doesUserOwnFileList Does not own', async () => {
      const created = (await listService.createFileList(listStub)) as FileListDocument;
      await expect(
        listService.doesUserOwnFileList(userStub2._id, created._id),
      ).resolves.toBeFalsy();
    });

    it('doesUserOwnFileList NotFound', async () => {
      const created = (await listService.createFileList(listStub)) as FileListDocument;
      listService.deleteFileList(created._id, userStub._id);
      await expect(listService.doesUserOwnFileList(userStub2._id, created._id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
