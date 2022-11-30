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
  userId = '';

  @Prop({ type: [TermSchema], required: true })
  @ApiProperty({ type: [Term] })
  @IsNotEmpty()
  @IsArray()
  @Type(() => Term)
  @ValidateNested({ each: true })
  terms: Term[];

  @Prop({ type: [] })
  @ApiProperty()
  files: any[];

  @Prop({ type: [ResultSchema], default: [] })
  @ApiProperty()
  results: Result[];
}

export const SearchSchema = SchemaFactory.createForClass(Search);
