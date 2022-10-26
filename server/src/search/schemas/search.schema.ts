import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Result, ResultSchema } from './result.schema';
import { Terms } from './terms.schema';

export type SearchDocument = Search & Document;

@Schema({ timestamps: { createdAt: 'created_at' } })
export class Search {
  @Prop({ type: String }) // Should this be a relation to User?
  @ApiProperty()
  userId = 'Kikki Hiiri';

  // Currently using timestamps option
  // @Prop({ type: Date, default: new Date() })
  // @ApiProperty()
  // date: Date;

  @Prop({ type: Terms }) // Should this be a relation to a template or Terms array, rather than a single Terms object?
  @ApiProperty()
  terms: Terms;

  @Prop({ type: [] }) // Either string array, or array of relations to database file objects
  @ApiProperty()
  files: any[];

  @Prop({ type: [ResultSchema], default: [] }) // Needs to use Schema within type. Unsure if this applies to non-array schema model types.
  @ApiProperty()
  results: Result[];
}

export const SearchSchema = SchemaFactory.createForClass(Search);
