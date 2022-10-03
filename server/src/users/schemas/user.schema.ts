import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {

  @Prop()
  @ApiProperty()
  name: string;

  @Prop()
  @ApiProperty()
  password: string;

  @Prop()
  @ApiProperty()
  email: string;
}

export const UserSchema = SchemaFactory.createForClass(User);