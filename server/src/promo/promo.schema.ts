import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PromoDocument = Promo & Document;

@Schema({ timestamps: true })
export class Promo {
  @Prop({ required: true, unique: true, uppercase: true })
  code: string;

  @Prop({ required: true })
  discountPercent: number;

  @Prop({ type: Number, default: null })
  maxDiscount: number;

  @Prop({ type: Number, default: null })
  minOrderAmount: number;

  @Prop({ default: 0 })
  usageLimit: number;

  @Prop({ default: 0 })
  usedCount: number;

  @Prop({ required: true })
  expiryDate: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const PromoSchema = SchemaFactory.createForClass(Promo);