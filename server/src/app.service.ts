import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class AppService {

  /**
   * Example of model injection. Remove this. See also app.module.ts for import example.
   * @param userModel 
   */
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  getHello(): string {
    return 'Hello World!';
  }

  /**
   * Example endpoint for model usage.
   * @todo remove this
   * @returns Admin user
   */
  async getAdmin(): Promise<User> {
    let admin = await this.userModel.findOne({name: 'admin'}).exec();

    if(!admin) {
      // Creating a new document.
      const newAdmin = new this.userModel({name: 'admin', password: 'kissa', email: 'etu.suku@tuni.fi'});

      admin = await newAdmin.save(); // Save new document, remember await if necessary
    }

    return admin;
  }

  /**
   * Example endpoint
   * @todo remove
   * @param user 
   * @returns 
   */
  async createUser(user: User): Promise<User> {
    return await new this.userModel(user).save();
  }
}
