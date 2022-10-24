import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import {
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

export type ValueSearchDocument = ValueSearch & Document;

@Schema()
export class ValueSearch {
  @Prop({ required: true })
  @ApiProperty()
  @IsString()
  userId: string;

  @Prop()
  @ApiProperty()
  @IsString()
  @IsOptional()
  title = 'Avain-arvohaku';

  @Prop({ required: true })
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Terms)
  @ValidateNested()
  terms: Terms;
}

export const ValueSearchSchema = SchemaFactory.createForClass(ValueSearch);
