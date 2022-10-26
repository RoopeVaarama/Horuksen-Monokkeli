import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export type TermsDocument = Terms & Document;

@Schema()
export class Terms {
  @Prop({ type: String, required: true })
  @ApiProperty()
  @IsString()
  key: string;

  @Prop({ type: Number, required: true })
  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(3)
  direction: number = 0;

  @Prop({ type: Number })
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  allowedOffset: number = 10;

  @Prop({ type: String })
  @ApiProperty()
  @IsString()
  valueMatch: string = '.*';

  @Prop({ type: String })
  @ApiProperty()
  @IsString()
  @IsOptional()
  valuePrune: string = '.*';

  @Prop({ type: String })
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  ignoreFirst: number = 0;

  @Prop({ type: String })
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  maxPerPage: number = 0;
}

export const TermsSchema = SchemaFactory.createForClass(Terms);
