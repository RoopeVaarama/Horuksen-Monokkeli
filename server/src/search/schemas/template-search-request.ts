import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { IsNotEmpty } from 'class-validator';

export type TemplateSearchRequestDocument = TemplateSearchRequest & Document;

@Schema()
export class TemplateSearchRequest {
  @Prop({ type: [], required: true })
  @ApiProperty()
  @IsNotEmpty()
  templates: any[];

  @Prop({ type: [], required: true })
  @ApiProperty()
  @IsNotEmpty()
  files: any[];
}

export const TemplateSearchRequestSchema = SchemaFactory.createForClass(TemplateSearchRequest);
