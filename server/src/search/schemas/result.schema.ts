import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type ResultDocument = Result & Document;

@Schema()
export class Result {
  @Prop()
  @ApiProperty()
  file: string;

  @Prop()
  @ApiProperty()
  page: number;

  @Prop()
  @ApiProperty()
  key: string;

  @Prop()
  @ApiProperty()
  value: string;

  @Prop()
  @ApiProperty()
  key_x: number;

  @Prop()
  @ApiProperty()
  key_y: number;

  @Prop()
  @ApiProperty()
  val_x: number;

  @Prop()
  @ApiProperty()
  val_y: number;
}

export const ResultSchema = SchemaFactory.createForClass(Result);
