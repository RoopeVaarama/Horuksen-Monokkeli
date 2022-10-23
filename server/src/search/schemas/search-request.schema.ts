import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '../../users/schemas/user.schema';
import { Terms } from '../../search/schemas/terms.schema';

export type ValueSearchDocument = SearchRequest & Document;


@Schema()
export class SearchRequest {

    @Prop({ required: true })
    @ApiProperty()
    @IsNotEmpty()
    @Type(() => Terms)
    @ValidateNested()
    terms: Terms;

    @Prop({ required: true })
    @ApiProperty()
    @IsNotEmpty()
    files: any[];

}

export const SearchRequestSchema = SchemaFactory.createForClass(SearchRequest);