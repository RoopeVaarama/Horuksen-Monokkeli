import { FileMeta } from 'src/file/schemas/filemeta.schema';

export const FileMetaStub = (): FileMeta => {
  return {
    filename: 'file.pdf',
    filepath: 'files/filename',
    author: undefined,
  };
};

// Express.Multer.File stub for use in createFileMeta
export const FileStub = (): any => {
  return {
    originalname: 'file.pdf',
    filename: 'filename',
    destination: 'files',
  };
};

export const FileStub2 = (): any => {
  return {
    originalname: 'file2.pdf',
    filename: 'filename2',
    destination: 'files',
  };
};
