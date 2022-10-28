import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ValueSearch, ValueSearchDocument } from './schemas/value-search.schema';

@Injectable()
export class TemplateService {
  constructor(@InjectModel(ValueSearch.name) private templateModel: Model<ValueSearchDocument>) {}

  // create a new search template to the database
  async createTemplate(template: ValueSearch): Promise<ValueSearch> {
    return await new this.templateModel(template).save();
  }

  // delete a template with the given id
  async deleteTemplate(id: string): Promise<boolean> {
    const deleteResponse = await this.templateModel.deleteOne({ _id: id }).exec();
    return deleteResponse.acknowledged;
  }

  // get all stored templates for a user
  async getTemplates(uid: string): Promise<ValueSearch[]> {
    const templates = await this.templateModel.find({ userId: uid }).exec();
    if (!templates.length) throw new NotFoundException('No templates found with that user id');
    return templates;
  }

  // get a template with the given template id
  async getTemplate(tid: string): Promise<ValueSearch> {
    if (!Types.ObjectId.isValid(tid)) throw new NotAcceptableException('Not a valid template id');
    const template = await this.templateModel.findOne({ _id: tid }).exec();
    if (!template) throw new NotFoundException('No template found with that template id');
    return template;
  }

  async getAllTemplates(): Promise<ValueSearch[]> {
    const templates = await this.templateModel.find().exec();
    if (!templates.length) throw new NotFoundException('No templates have been created');
    return templates;
  }
}
