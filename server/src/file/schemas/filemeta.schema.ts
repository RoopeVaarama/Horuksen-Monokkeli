import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { User } from '../../users/schemas/user.schema';

export type FileMetaDocument = FileMeta & mongoose.Document;

@Schema({ timestamps: {} })
export class FileMeta {
  @Prop({ type: String, required: true })
  @ApiProperty()
  filename: string;

  @Prop({ type: String, required: true })
  @ApiProperty()
  filepath: string;

  /*
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @ApiProperty()
  author: User;
  */

  @Prop({ type: String })
  @ApiProperty()
  author: string;
}

export const FileMetaSchema = SchemaFactory.createForClass(FileMeta);
