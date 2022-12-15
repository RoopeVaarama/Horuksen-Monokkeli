import { FileList } from 'src/file/schemas/filelist.schema';
import { FileMetaStub } from './filemeta.schema.stub';

export const FileListStub = (): FileList => {
  return {
    title: 'stub-list',
    author: undefined,
    files: [FileMetaStub()],
  };
};
