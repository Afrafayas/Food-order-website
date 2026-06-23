import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop([{
    product: { type: Types.ObjectId, ref: 'Product' },
    quantity: { type: Number },
    price: { type: Number }
  }])
  items: Array<{
    product: Types.ObjectId;
    quantity: number;
    price: number;
  }>;

  @Prop({ required: true })
  totalPrice: number;

  @Prop({ default: 'pending', enum: ['pending', 'confirmed', 'delivered', 'cancelled'] })
  status: string;

  @Prop()
  deliveryAddress: string;

  @Prop()
  paymentMethod: string;

  @Prop({ default: false })
  isPaid: boolean;

  @Prop({ type: Number, required: false })
  deliveryLat?: number;

  @Prop({ type: Number, required: false })
  deliveryLng?: number;

  @Prop({ type: Number, default: 0 })
  deliveryFee: number;

  @Prop({ type: Number, default: 30 })
  estimatedDeliveryTime: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);