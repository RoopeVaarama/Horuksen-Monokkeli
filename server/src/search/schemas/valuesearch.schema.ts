import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document } from 'mongoose';
import { IsBoolean, IsNumber, IsOptional, IsString, Max, Min, ValidateNested } from 'class-validator';
import { Terms } from './terms.schema';
import { Type } from 'class-transformer';
import { User } from '../../users/schemas/user.schema';

export type ValueSearchDocument = ValueSearch & Document;


@Schema()
export class ValueSearch {

    @Prop({ required: true })
    @ApiProperty()
    @IsString()
    userId: string;

    @Prop()
    @ApiProperty()
    @IsString()
    @IsOptional()
    title: string = 'Avain-arvohaku';

    @Prop({ required: true })
    @ApiProperty()
    @Type(() => Terms)
    @ValidateNested()
    terms: Terms;

}

export const ValueSearchSchema = SchemaFactory.createForClass(ValueSearch);