import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/user/user.schema';
import { Template, TemplateDocument } from './schemas/template.schema';

@Injectable()
export class TemplateService {
  constructor(@InjectModel(Template.name) private templateModel: Model<TemplateDocument>) {}

  // API METHODS ===========================================================================

  async createTemplate(template: Template): Promise<Template> {
    return await new this.templateModel(template).save();
  }

  async getAllTemplates(): Promise<Template[]> {
    return await this.templateModel.find().exec();
  }

  async getTemplateById(id: string): Promise<Template> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid id');
    const data = await this.templateModel.findById(id).exec();
    if (!data) throw new NotFoundException('No template matching the id exists');
    return data;
  }

  async getTemplatesByUserId(uid: string): Promise<Template[]> {
    if (!Types.ObjectId.isValid(uid)) throw new BadRequestException('Invalid user id');
    const data = await this.templateModel.find({ author: uid }).exec();
    if (!data.length) throw new NotFoundException('No templates matching the user id exist');
    return data;
  }

  async updateTemplate(id: string, template: Template): Promise<Template> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid id');
    const updated = await this.templateModel.findOneAndUpdate({ _id: id }, { ...template }).exec();
    if (!updated) throw new NotFoundException('No template matching the id exists');
    return await this.templateModel.findById(updated._id).exec();
  }

  async deleteTemplate(id: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid id');
    const deleteRes = await this.templateModel.deleteOne({ _id: id }).exec();
    if (!deleteRes.deletedCount) throw new NotFoundException('No template matching the id exists');
    return deleteRes.acknowledged;
  }

  // HELPER METHODS ========================================================================

  async verifyAuthor(id: Types.ObjectId, userId: Types.ObjectId): Promise<boolean> {
    // Checks if template with given id has given user as author
    if (!Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid id');
    if (!Types.ObjectId.isValid(userId)) throw new BadRequestException('Invalid user id');
    const data = await this.templateModel.findById(id);
    if (!data) throw new NotFoundException('No template matching the id exists');
    if (data.author.toString() === userId.toString()) return true;
    return false;
  }
}
