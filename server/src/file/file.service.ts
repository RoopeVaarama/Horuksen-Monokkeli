import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { existsSync, opendirSync, readdir, unlinkSync } from 'fs';
import { FileMeta, FileMetaDocument } from './schemas/filemeta.schema';

@Injectable()
export class FileService {
  constructor(@InjectModel(FileMeta.name) private fileMetaModel: Model<FileMetaDocument>) {}

  async canFileBeFound(fileId: string): Promise<boolean> {
    try {
      await this.fileMetaModel.findById(fileId);
    } catch (err) {
      throw new HttpException('File not found', 404);
    }
    return true;
  }

  async getFileId(filePath: string) {
    return await this.fileMetaModel.find({ filepath: filePath }).exec();
  }

  // file could use a type definition
  async createFileMeta(file: Express.Multer.File, userId: string): Promise<FileMeta> {
    const filemeta = new FileMeta();
    filemeta.filename = file.originalname;
    filemeta.filepath = file.destination + '/' + file.filename;
    filemeta.author = userId;
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

  async getFilesByIds(fileIds: string[]): Promise<FileMeta[]> {
    const metasToReturn: FileMeta[] = [];
    for (let i = 0; i < fileIds.length; i++) {
      await this.canFileBeFound(fileIds.at(i));
      let fileMetaToPush: FileMeta;
      try {
        fileMetaToPush = await this.fileMetaModel.findById(fileIds.at(i));
      } catch (err) {
        continue;
      }
      metasToReturn.push(fileMetaToPush);
    }
    return metasToReturn;
  }

  async deleteFile(id: string): Promise<boolean> {
    await this.canFileBeFound(id);
    const fileToRemove = (await this.fileMetaModel.findById(id)).filepath;

    try {
      unlinkSync(fileToRemove);
    } catch (err) {
      //File doesn't exist for some magical reason, but meta still needs to
      //be removed, continuing...
    }
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
