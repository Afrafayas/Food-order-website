import { IsString, IsNumber, IsOptional, IsBoolean, IsArray } from 'class-validator';

export class CreateOrderDto {
  @IsArray()
  items: Array<{
    product: string;
    quantity: number;
    price: number;
  }>;

  @IsNumber()
  totalPrice: number;

  @IsString()
  deliveryAddress: string;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;

  @IsNumber()
  @IsOptional()
  deliveryLat?: number;

  @IsNumber()
  @IsOptional()
  deliveryLng?: number;

  @IsNumber()
  @IsOptional()
  deliveryFee?: number;

  @IsNumber()
  @IsOptional()
  estimatedDeliveryTime?: number;
}