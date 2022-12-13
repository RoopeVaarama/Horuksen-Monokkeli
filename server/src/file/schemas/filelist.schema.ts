import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import * as mongoose from 'mongoose';
import { FileMeta } from './filemeta.schema';
import { User } from '../../user/user.schema';
import { IsString, IsNotEmpty } from 'class-validator';

export type FileListDocument = FileList & mongoose.Document;

@Schema({ timestamps: {} })
export class FileList {
  @Prop({ type: String, required: true, default: '' }) // Should title be unique?
  @ApiProperty({ description: 'Name of the file list. Is displayed to user.' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Prop({ type: String, default: 'Placeholder', required: false })
  @IsNotEmpty()
  @IsString()
  author: string;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'FileMeta' }], required: true })
  @ApiProperty({ description: "Array of file ID's that this list holds.", required: true })
  files: FileMeta[];
}

export const FileListSchema = SchemaFactory.createForClass(FileList);
