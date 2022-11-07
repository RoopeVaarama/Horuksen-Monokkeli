import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { existsSync, opendirSync, readdir } from 'fs';
import { FileMeta, FileMetaDocument } from './schemas/filemeta.schema';

@Injectable()
export class FileService {
  constructor(@InjectModel(FileMeta.name) private fileMetaModel: Model<FileMetaDocument>) {}

  // file could use a type definition
  async createFileMeta(file): Promise<FileMeta> {
    const filemeta = new FileMeta();
    filemeta.filename = file.originalname;
    filemeta.filepath = file.destination + '/' + file.filename;
    filemeta.author = 'placeholder';
    return await new this.fileMetaModel(filemeta).save();
  }

  async getFileMeta(id): Promise<FileMeta> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid id');
    const file = await this.fileMetaModel.findById(id).exec();
    if (!file) throw new NotFoundException('No file matching the id exists');
    return file;
  }

  async getFiles(): Promise<FileMeta[]> {
    const files = await this.fileMetaModel.find().select({ filepath: 0 }).exec(); // filepath is excluded from returned objects
    return files;
  }

  async deleteFileMeta(id: string): Promise<boolean> {
    // TODO: Delete saved file alongside filemeta
    const deleteResponse = await this.fileMetaModel.deleteOne({ _id: id }).exec();
    return deleteResponse.acknowledged;
  }

  async getAllFiles(): Promise<string[]> {
    const filePath = 'test_pdfs/';
    if (!existsSync(filePath)) {
      throw new HttpException('Folder not found.', 404);
    }
    const arrToReturn = []; // Yes, you should use const here
    const directory = opendirSync(filePath);
    let file;
    let index = 0;
    while ((file = directory.readSync()) !== null) {
      if (!file.name.includes('.pdf')) {
        continue;
      }
      // console.log(file.name)
      arrToReturn[index] = file.name;
      index++;
    }
    directory.closeSync();

    return arrToReturn;
  }
}
