import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  /**
   * @param user User to create
   * @returns Created user
   */
  async createUser(user: User): Promise<User> {
    return await new this.userModel(user).save();
  }

  /**
   * Updates existing user. Updates only the properties specified in the body,
   * so you can just omit the things you don't want to update.
   * @param id ID of user to update
   * @param user User object
   * @returns Updated user, excluding password
   */
  async updateUser(id: string, user: User): Promise<User> {
    const updatedUser = await this.userModel
      .findOneAndUpdate({ _id: id }, { ...user })
      .exec();

    return await this.userModel
      .findById(updatedUser._id)
      .select({ password: 0 })
      .exec();
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

  /**
   *
   * @returns A list of all users.
   */
  async getUsers(): Promise<User[]> {
    const users = await this.userModel.find().select({ password: 0 }).exec();

    return users;
  }
}
