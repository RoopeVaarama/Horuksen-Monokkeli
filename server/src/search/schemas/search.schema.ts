import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type SearchDocument = Search & Document;

@Schema()
export class Search {

  @Prop()
  @ApiProperty()
  key: string;

  @Prop()
  @ApiProperty()
  valueIsText: boolean;

  @Prop()
  @ApiProperty()
  direction: number;
}

export const SearchSchema = SchemaFactory.createForClass(Search);