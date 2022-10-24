import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '../../users/schemas/user.schema';
import { Terms } from '../../search/schemas/terms.schema';
import { ValueSearch, ValueSearchSchema } from './value-search.schema';

export type ValueSearchDocument = CreateRequest & Document;

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
