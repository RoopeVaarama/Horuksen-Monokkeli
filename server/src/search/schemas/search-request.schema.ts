import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Term, TermSchema } from '../../template/schemas/term.schema';

export type SearchRequestDocument = SearchRequest & Document;

@Schema()
export class SearchRequest {
  @Prop({ type: [TermSchema], required: true })
  @ApiProperty({ type: [Term] })
  @IsNotEmpty()
  @IsArray()
  @Type(() => Term)
  @ValidateNested({ each: true })
  terms: Term[];

  @Prop({ type: [], required: true })
  @ApiProperty()
  @IsNotEmpty()
  files: any[];
}

export const SearchRequestSchema = SchemaFactory.createForClass(SearchRequest);
