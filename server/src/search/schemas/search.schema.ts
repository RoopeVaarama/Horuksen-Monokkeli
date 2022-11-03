import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Result, ResultSchema } from './result.schema';
import { Term, TermSchema } from '../../template/schemas/term.schema';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export type SearchDocument = Search & Document;

@Schema({ timestamps: {} })
export class Search {
  @Prop({ type: String }) // Should this be a relation to User?
  @ApiProperty()
  userId = 'Kikki Hiiri';

  @Prop({ type: [TermSchema], required: true })
  @ApiProperty({ type: [Term] })
  @IsNotEmpty()
  @IsArray()
  @Type(() => Term)
  @ValidateNested({ each: true })
  terms: Term[];

  @Prop({ type: [] }) // Either string array, or array of relations to database file objects
  @ApiProperty()
  files: any[];

  @Prop({ type: [ResultSchema], default: [] }) // Needs to use Schema within type. Unsure if this applies to non-array schema model types.
  @ApiProperty()
  results: Result[];
}

export const SearchSchema = SchemaFactory.createForClass(Search);
