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
    return await new this.fileListModel(list).save();
  }

  async addFilesToFileList(listId: string, metas: FileMeta[]): Promise<FileList> {
    const currentMetas: FileMeta[] = (
      await (await this.fileListModel.findById(listId)).populate('files')
    ).files;
    let metasToAdd: FileMeta[] = [];
    //TODO
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
    metasToAdd = metasToAdd.concat(currentMetas);
    const doc = await this.fileListModel.findByIdAndUpdate(
      { _id: listId },
      { files: metasToAdd },
      { new: true },
    );
    return doc;
  }

  async removeFilesFromFileList(listId: string, metas: FileMeta[]): Promise<FileList> {
    const currentMetas: FileMeta[] = (
      await (await this.fileListModel.findById(listId)).populate('files')
    ).files;
    const metasToAdd: FileMeta[] = [];
    //TODO
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
    const doc = await this.fileListModel.findByIdAndUpdate(
      { _id: listId },
      { files: metasToAdd },
      { new: true },
    );
    return doc;
  }

  async updateFileList(listId: string, list: FileList): Promise<FileList> {
    await this.canListBeFound(listId);

    return await this.fileListModel.findOneAndUpdate(
      { _id: listId }, //which list to update
      { title: list.title, files: list.files }, //only changes these 2 values
      { new: true }, //returns the updated version instead of old one
    );
  }

  async deleteFileList(listId: string): Promise<boolean> {
    await this.canListBeFound(listId);
    const deleteResponse = await this.fileListModel.deleteOne({ _id: listId }).exec();
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
