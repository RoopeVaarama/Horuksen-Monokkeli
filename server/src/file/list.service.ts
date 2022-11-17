import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileService } from './file.service';
import { FileList, FileListDocument } from './schemas/filelist.schema';
import { FileMeta, FileMetaDocument } from './schemas/filemeta.schema';

@Injectable()
export class ListService {
  constructor(@InjectModel(FileList.name) private fileListModel: Model<FileListDocument>) {}

  async canListBeFound(listId: string): Promise<boolean> {
    try {
      await this.fileListModel.findById(listId);
    } catch (err) {
      throw new HttpException('List not found', 404);
    }
    return true;
  }

  async createFileList(list: FileList): Promise<FileList> {
    //TODO: retrieve author id(?)
    list.author = 'Author added in code';
    return await new this.fileListModel(list).save();
  }

  async addFilesToFileList(listId: string, metas: FileMeta[]): Promise<FileList> {
    const currentMetas: FileMeta[] = (
      await (await this.fileListModel.findById(listId)).populate('files')
    ).files;
    let metasToAdd: FileMeta[] = [];
    //A little bit purkkaviritelmä and O(m*n)
    //If someone has idea for better solution, feel free to modify
    outer: for (let newMeta = 0; newMeta < metas.length; newMeta++) {
      inner: for (let existingMeta = 0; existingMeta < currentMetas.length; existingMeta++) {
        if (metas.at(newMeta).filepath == currentMetas.at(existingMeta).filepath) {
          continue outer;
        }
      }
      metasToAdd.push(metas.at(newMeta));
    }
    const filter = { _id: listId };
    metasToAdd = metasToAdd.concat(currentMetas);
    const update = { files: metasToAdd };
    const doc = await this.fileListModel.findByIdAndUpdate(filter, update, {
      new: true,
    });
    return doc;
  }

  async removeFilesFromFileList(listId: string, metas: FileMeta[]): Promise<FileList> {
    const currentMetas: FileMeta[] = (
      await (await this.fileListModel.findById(listId)).populate('files')
    ).files;
    const metasToAdd: FileMeta[] = [];
    //A little bit purkkaviritelmä and O(m*n)
    //If someone has idea for better solution, feel free to modify
    outer: for (let existingMeta = 0; existingMeta < currentMetas.length; existingMeta++) {
      inner: for (let metaToDelete = 0; metaToDelete < metas.length; metaToDelete++) {
        if (metas.at(metaToDelete).filepath == currentMetas.at(existingMeta).filepath) {
          continue outer;
        }
      }
      metasToAdd.push(currentMetas.at(existingMeta));
    }
    const filter = { _id: listId };
    const update = { files: metasToAdd };
    const doc = await this.fileListModel.findByIdAndUpdate(filter, update, {
      new: true,
    });
    return doc;
  }

  async updateFileList(id: string, list: FileList): Promise<FileList> {
    const updated = await this.fileListModel.findOneAndUpdate({ _id: id }, { ...list }).exec();
    return await this.fileListModel.findById(updated._id).exec();
  }

  async deleteFileList(id: string): Promise<boolean> {
    const deleteResponse = await this.fileListModel.deleteOne({ _id: id }).exec();
    return deleteResponse.acknowledged;
  }

  async getAll(): Promise<FileList[]> {
    const data = await this.fileListModel.find().populate('files');
    return data;
  }

  async getOne(id: string): Promise<FileList> {
    const data = await (await this.fileListModel.findById(id)).populate('files');
    return data;
  }
}
