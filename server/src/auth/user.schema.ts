import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop({ default: 'user', enum: ['user', 'admin'] })
  role: string;

  @Prop({ default: false })
  isVerified: boolean;
@Prop({ type: String, default: null })
otp: string | null;

@Prop({ type: Date, default: null })
otpExpires: Date | null;
}

export const UserSchema = SchemaFactory.createForClass(User);