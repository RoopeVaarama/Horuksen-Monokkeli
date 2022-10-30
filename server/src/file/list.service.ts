import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FileList, FileListDocument } from './schemas/filelist.schema';

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

  async addFileToFileList(fileId: string, listId: string): Promise<boolean> {
    return true;
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
