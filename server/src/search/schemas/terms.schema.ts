import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { IsBoolean, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export type TermsDocument = Terms & Document;


@Schema()
export class Terms {

    @Prop({ required: true })
    @ApiProperty()
    @IsString()
    key: string;

    @Prop({ required: true })
    @ApiProperty()
    @IsNumber()
    @Min(0)
    @Max(3)
    direction: number = 0;

    @Prop()
    @ApiProperty()
    @IsNumber()
    @IsOptional()
    allowedOffset: number = 10;

    @Prop()
    @ApiProperty()
    @IsString()
    valueMatch: string = '.*';

    @Prop()
    @ApiProperty()
    @IsString()
    @IsOptional()
    valuePrune: string = '.*';

    @Prop()
    @ApiProperty()
    @IsNumber()
    @IsOptional()
    ignoreFirst: number = 0;

    @Prop()
    @ApiProperty()
    @IsNumber()
    @IsOptional()
    maxPerPage: number = 0;

}

export const TermsSchema = SchemaFactory.createForClass(Terms);