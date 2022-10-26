import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { IsBoolean, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

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
  direction = 0;

  @Prop({ type: Number })
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  allowedOffset = 10;

  @Prop({ type: String })
  @ApiProperty()
  @IsString()
  valueMatch = '.*';

  @Prop({ type: String })
  @ApiProperty()
  @IsString()
  @IsOptional()
  valuePrune = '.*';

  @Prop({ type: String })
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  ignoreFirst = 0;

  @Prop({ type: String })
  @ApiProperty()
  @IsNumber()
  @IsOptional()
  maxPerPage = 0;
}

export const TermsSchema = SchemaFactory.createForClass(Terms);
