import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ValueSearch, ValueSearchSchema } from './value-search.schema';

export type CreateRequestDocument = CreateRequest & Document;

@Schema()
export class CreateRequest {
  @Prop({ type: [ValueSearchSchema], required: true }) // Needs to use Schema within type
  @ApiProperty({ type: [ValueSearch] })
  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ValueSearch)
  templates: ValueSearch[];
}

export const CreateRequestSchema = SchemaFactory.createForClass(CreateRequest);
