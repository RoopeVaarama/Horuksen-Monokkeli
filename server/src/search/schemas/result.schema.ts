import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type ResultDocument = Result & Document;

@Schema()
export class Result {
  @Prop({ type: String })
  @ApiProperty()
  file: string;

  @Prop({ type: Number })
  @ApiProperty()
  page: number;

  @Prop({ type: String })
  @ApiProperty()
  key: string;

  @Prop({ type: String })
  @ApiProperty()
  value: string;

  @Prop({ type: Number })
  @ApiProperty()
  key_x: number;

  @Prop({ type: Number })
  @ApiProperty()
  key_y: number;

  @Prop({ type: Number })
  @ApiProperty()
  val_x: number;

  @Prop({ type: Number })
  @ApiProperty()
  val_y: number;
}

export const ResultSchema = SchemaFactory.createForClass(Result);
