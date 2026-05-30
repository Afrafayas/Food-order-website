import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OfferDocument = Offer & Document;

@Schema({ timestamps: true })
export class Offer {
  @Prop({ required: true })
  title: string;
  // "Happy Hour!"

  @Prop({ required: true })
  description: string;
  // "15% off on all orders!"

  @Prop({ required: true })
  startTime: string;
  // "14:00" (24hr format)

  @Prop({ required: true })
  endTime: string;
  // "16:00"

  @Prop({ required: true })
  discountPercent: number;
  // 15

  @Prop({ default: true })
  everyday: boolean;
  // true = every day

  @Prop({ default: '#FF6B35' })
  color: string;
  // UI color

  @Prop({ default: true })
  isActive: boolean;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);