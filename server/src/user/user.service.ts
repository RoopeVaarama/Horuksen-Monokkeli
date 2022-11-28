import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(dto: User): Promise<User> {
    const newDto = { ...dto };
    newDto.password = await bcrypt.hash(dto.password, 10);
    return await new this.userModel(newDto).save();
  }

  async update(id: string, dto: User): Promise<User> {
    let user = await this.userModel.findOneAndUpdate({ _id: id }, { ...dto }).exec();
    if (!user) {
      throw new NotFoundException();
    }
    user = await this.userModel.findById(id);
    return user;
  }

  async findValidateByUsername(username: string): Promise<User> {
    return await this.userModel.findOne({ username: username }).select({ password: 0 }).exec();
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().select({ password: 0 }).exec();
  }

  async findOne(id: string): Promise<UserDocument> {
    return this.userModel.findById(id).exec();
  }

  /**
   * Deletes user with given id
   * @param id ID of user to delete
   * @returns Boolean, whether the delete was successful or not
   */
  async deleteUser(id: string): Promise<boolean> {
    const deleteResponse = await this.userModel.deleteOne({ _id: id }).exec();
    return deleteResponse.acknowledged;
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    const userWithPassword = await this.userModel.findOne({ username: user.username }).exec();
    const res = await bcrypt.compare(password, userWithPassword.password);
    return res;
  }
}
