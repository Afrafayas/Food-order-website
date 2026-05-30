import { IsString, IsNumber, IsBoolean, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePromoDto {
  @IsString()
  code: string;

  @IsNumber()
  discountPercent: number;

  @IsNumber()
  @IsOptional()
  maxDiscount?: number;

  @IsNumber()
  @IsOptional()
  minOrderAmount?: number;

  @IsNumber()
  @IsOptional()
  usageLimit?: number;

  @IsDate()
  @Type(() => Date)
  expiryDate: Date;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}