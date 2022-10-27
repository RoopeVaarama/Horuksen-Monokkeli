import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { IsBoolean, IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export type TermDocument = Term & Document;

@Schema({ _id: false })
export class Term {
  @Prop({ type: String, required: true })
  @ApiProperty({ type: String, default: 'keyword' })
  @IsString()
  @IsNotEmpty()
  key: string;

  // QUESTION: Should keyword only be implemented in Terms, elsewhere entirely, or using discriminators?
  @Prop({ type: Boolean, default: false })
  @ApiProperty({ type: Boolean, required: false, default: false })
  @IsBoolean()
  @IsNotEmpty()
  keyOnly: boolean;

  @Prop({ type: Number, default: 0, min: 0, max: 3 })
  @ApiProperty({ type: Number, required: false, default: 0, minimum: 0, maximum: 3 })
  @IsNumber()
  @Min(0)
  @Max(3)
  direction: number;

  @Prop({ type: Number, required: false, default: 10 })
  @ApiProperty({ type: Number, required: false, default: 10 })
  @IsNumber()
  allowedOffset: number;

  @Prop({ type: String, required: false, default: '.*' })
  @ApiProperty({ type: String, required: false, default: '.*' })
  @IsString()
  valueMatch: string;

  @Prop({ type: String, required: false, default: '.*' })
  @ApiProperty({ type: String, required: false, default: '.*' })
  @IsString()
  valuePrune: string;

  @Prop({ type: Number, required: false, default: 0 })
  @ApiProperty({ type: Number, required: false, default: 0 })
  @IsNumber()
  ignoreFirst: number;

  @Prop({ type: Number, required: false, default: 0 })
  @ApiProperty({ type: Number, required: false, default: 0 })
  @IsNumber()
  maxPerPage: number;
}

export const TermSchema = SchemaFactory.createForClass(Term);
