import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BannerDocument = Banner & Document;

@Schema({ timestamps: true })
export class Banner {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  subtitle: string;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  buttonText: string;

  @Prop({ default: '/user-panel/menu' })
  buttonLink: string;

  @Prop({ default: 'from-orange-600 to-red-600' })
  bgColor: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: 0 })
  order: number;
}

export const BannerSchema = SchemaFactory.createForClass(Banner);