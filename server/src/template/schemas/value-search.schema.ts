import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Terms } from '../../search/schemas/terms.schema';

export type ValueSearchDocument = ValueSearch & Document;

@Schema()
export class ValueSearch {
  @Prop({ type: String, required: true })
  @ApiProperty()
  @IsString()
  userId: string;

  @Prop({ type: String })
  @ApiProperty()
  @IsString()
  @IsOptional()
  title: string = 'Avain-arvohaku';

  @Prop({ type: Terms, required: true })
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Terms)
  @ValidateNested()
  terms: Terms;
}

export const ValueSearchSchema = SchemaFactory.createForClass(ValueSearch);
