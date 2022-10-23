import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Result } from './result.schema';
import { Terms } from './terms.schema';

export type ResultDocument = Search & Document;

@Schema()
export class Search {
  @Prop()
  @ApiProperty()
  userId = 'Kikki Hiiri';

  @Prop({ default: new Date() })
  @ApiProperty()
  date: number;

  @Prop()
  @ApiProperty()
  terms: Terms;

  @Prop()
  @ApiProperty()
  files: any[];

  @Prop()
  @ApiProperty()
  results: Result[] = [];
}

export const SearchSchema = SchemaFactory.createForClass(Search);
