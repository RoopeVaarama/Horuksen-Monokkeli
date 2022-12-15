import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Connection, connect, Model, Types } from 'mongoose';
import { FileService } from '../file.service';
import { FileMeta, FileMetaDocument, FileMetaSchema } from '../schemas/filemeta.schema';
import { FileMetaStub, FileStub } from '../test/stubs/filemeta.schema.stub';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('FileServiceSpec', () => {
  let fileService: FileService;
  let mongod: MongoMemoryServer;
  let mongoConnection: Connection;
  let fileMetaModel: Model<FileMeta>;

  // Setup testing environment before running any tests
  beforeAll(async () => {
    mongod = await MongoMemoryServer.create(); // Create Mocked MongoDB memory server instance
    const uri = mongod.getUri(); // Get memory server instance URI
    mongoConnection = (await connect(uri)).connection; // Connect to memory server
    fileMetaModel = mongoConnection.model(FileMeta.name, FileMetaSchema);

    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService, { provide: getModelToken(FileMeta.name), useValue: fileMetaModel }],
    }).compile();

    fileService = module.get<FileService>(FileService);
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

  describe('File Service Methods', () => {
    const userStub = {
      _id: new Types.ObjectId('6380c7d7ca85580f1d5b69eb'),
    } as any;

    const userStub2 = {
      _id: new Types.ObjectId('6280c7d7ca85580f1d5b69eb'),
    } as any;

    it('createFileMeta', async () => {
      const created = await fileService.createFileMeta(FileStub(), userStub._id);
      expect(created.filename).toBe(FileMetaStub().filename); // Check for param property
      expect(created).toHaveProperty('_id'); // Check for generated property
    });

    it('getFileMeta', async () => {
      const created = (await fileService.createFileMeta(
        FileStub(),
        userStub._id,
      )) as FileMetaDocument;
      const getById = (await fileService.getFileMeta(
        created._id,
        userStub._id,
      )) as FileMetaDocument;
      expect(getById.filename).toBe(created.filename);
      expect(getById.author).toBe(created.author);
      expect(getById.filepath).toBe(created.filepath);
      expect(JSON.stringify(getById._id)).toBe(JSON.stringify(created._id));
      expect(getById).toHaveProperty('createdAt');
      expect(getById).toHaveProperty('updatedAt');
    });

    // TODO: getFileMeta error branch cases: Unauthorized, BadRequest, NotFound

    it('getFiles empy & populated', async () => {
      await fileService.createFileMeta(FileStub(), userStub._id); // Populate DB
      const getEmpty = await fileService.getFiles(userStub2._id);
      const getAll = await fileService.getFiles(userStub._id);
      expect(getEmpty).toHaveLength(0);
      expect(getAll).toHaveLength(1);
      expect(getAll[0].filename).toBe(FileMetaStub().filename);
    });

    it('getFilesByIds', async () => {
      const created = (await fileService.createFileMeta(
        FileStub(),
        userStub._id,
      )) as FileMetaDocument;
      const getByIds = (await fileService.getFilesByIds(
        [created._id],
        userStub._id,
      )) as FileMetaDocument[];
      expect(getByIds[0].filename).toBe(created.filename);
      expect(getByIds[0].author).toBe(created.author);
      expect(getByIds[0].filepath).toBe(created.filepath);
      expect(JSON.stringify(getByIds[0]._id)).toBe(JSON.stringify(created._id));
      expect(getByIds[0]).toHaveProperty('createdAt');
      expect(getByIds[0]).toHaveProperty('updatedAt');
    });

    it('deleteFile', async () => {
      const created = (await fileService.createFileMeta(
        FileStub(),
        userStub._id,
      )) as FileMetaDocument;
      await expect(fileService.deleteFile(created._id)).resolves.toBeTruthy();
    });

    // Helper methods
    it('getFileId', async () => {
      const created = (await fileService.createFileMeta(
        FileStub(),
        userStub._id,
      )) as FileMetaDocument;
      const getId = (await fileService.getFileId(created.filepath)) as FileMetaDocument[];
      expect(JSON.stringify(getId[0]._id)).toBe(JSON.stringify(created._id));
    });

    it('canFileBeFound', async () => {
      const created = (await fileService.createFileMeta(
        FileStub(),
        userStub._id,
      )) as FileMetaDocument;
      await expect(fileService.canFileBeFound(created._id)).resolves.toBeTruthy();
    });

    it('canFileBeFound NotFound', async () => {
      const created = (await fileService.createFileMeta(
        FileStub(),
        userStub._id,
      )) as FileMetaDocument;
      fileService.deleteFile(created._id);
      await expect(fileService.canFileBeFound(created._id)).rejects.toThrow(NotFoundException);
    });

    it('doesUserOwnFile Owns', async () => {
      const created = (await fileService.createFileMeta(
        FileStub(),
        userStub._id,
      )) as FileMetaDocument;
      await expect(fileService.doesUserOwnFile(userStub._id, created._id)).resolves.toBeTruthy();
    });

    it('doesUserOwnFile Does not own', async () => {
      const created = (await fileService.createFileMeta(
        FileStub(),
        userStub._id,
      )) as FileMetaDocument;
      await expect(fileService.doesUserOwnFile(userStub2._id, created._id)).resolves.toBeFalsy();
    });

    it('doesUserOwnFile NotFound', async () => {
      const created = (await fileService.createFileMeta(
        FileStub(),
        userStub._id,
      )) as FileMetaDocument;
      fileService.deleteFile(created._id);
      await expect(fileService.doesUserOwnFile(userStub._id, created._id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
