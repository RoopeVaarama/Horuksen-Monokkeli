import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';

export type UserDocument = User & mongoose.Document;

@Schema({ timestamps: { createdAt: 'created_at' } })
export class User {
  @Prop({ unique: true, required: true, type: String })
  @ApiProperty()
  username: string;

  @Prop({ type: String })
  @ApiProperty()
  firstName: string;

  @Prop({ type: String })
  @ApiProperty()
  lastName: string;

  @Prop({ type: String })
  @ApiProperty()
  email: string;

  @Prop({ type: String })
  @ApiProperty()
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
