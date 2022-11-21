import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { FileMeta } from './filemeta.schema';
import { User } from '../../user/user.schema';

export type FileListDocument = FileList & mongoose.Document;

@Schema({ timestamps: {} })
export class FileList {
  @Prop({ type: String, required: true }) // Should title be unique?
  @ApiProperty({ description: 'Name of the file list. Is displayed to user.' })
  title: string;

  /*
  // Auto-filled fields should not be ApiProperties
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;
  */

  @Prop({ type: String, default: 'Placeholder', required: false })
  author: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FileMeta' }] })
  @ApiProperty({ description: "Array of file ID's that this list holds." })
  files: FileMeta[];
}

export const FileListSchema = SchemaFactory.createForClass(FileList);
