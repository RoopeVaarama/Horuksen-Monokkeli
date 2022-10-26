import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Terms } from '../../search/schemas/terms.schema';

export type SearchRequestDocument = SearchRequest & Document;

@Schema()
export class SearchRequest {
  @Prop({ type: Terms, required: true })
  @ApiProperty()
  @IsNotEmpty()
  @Type(() => Terms)
  @ValidateNested()
  terms: Terms;

  @Prop({ type: [], required: true })
  @ApiProperty()
  @IsNotEmpty()
  files: any[];
}

export const SearchRequestSchema = SchemaFactory.createForClass(SearchRequest);
