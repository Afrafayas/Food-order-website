import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

@Schema({ timestamps: true })
export class Product {

  // Basic Info
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  image: string;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  // Price
  @Prop({ required: true })
  price: number;

  @Prop({ type: Number, default: null })
  originalPrice: number | null;

  // Discount
  @Prop({ default: 0 })
  discountPercent: number;

  @Prop({ default: false })
  isOnSale: boolean;

  // Deal Tag
  @Prop({ default: '' })
  dealTag: string;
  // 'Best Seller' | 'New Arrival' | 'Limited Time' | 'Mega Deal' | ''

  // Stock
  @Prop({ default: 0 })
  stock: number;

  @Prop({ default: true })
  isAvailable: boolean;

  // Ratings
  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviewCount: number;

  // Wishlist
  @Prop({ default: 0 })
  wishlistCount: number;
 @Prop({ type: Date, default: null })
 dealExpiry: Date | null;

}

export const ProductSchema = SchemaFactory.createForClass(Product);