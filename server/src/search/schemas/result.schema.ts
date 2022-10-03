import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

export type ResultDocument = Result & Document;

@Schema()
export class Result {

    @Prop()
    @ApiProperty()
    key: string;

    @Prop()
    @ApiProperty()
    value: string;

}

export const ResultSchema = SchemaFactory.createForClass(Result);