import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Term } from '../../template/schemas/term.schema';

export type SearchRequestDocument = SearchRequest & Document;

@Schema()
export class SearchRequest {
  @Prop({ type: Term, required: true })
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Term)
  @ValidateNested()
  terms: Term;

  @Prop({ type: [], required: true })
  @ApiProperty()
  @IsNotEmpty()
  files: any[];
}

export const SearchRequestSchema = SchemaFactory.createForClass(SearchRequest);
