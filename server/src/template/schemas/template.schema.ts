import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { User } from '../../user/user.schema';
import { Term, TermSchema } from './term.schema';
import { Type } from 'class-transformer';

export type TemplateDocument = Template & Document;

@Schema({ timestamps: {} })
export class Template {
  @Prop({ type: String, required: true, default: 'untitled' })
  @ApiProperty({ type: String, default: 'title' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: User;

  @Prop({ type: [TermSchema], required: true })
  @ApiProperty({ type: [Term] })
  @IsNotEmpty()
  @IsArray()
  @Type(() => Term)
  @ValidateNested({ each: true })
  terms: Term[];
}

export const TemplateSchema = SchemaFactory.createForClass(Template);
