import { 
  IsString, 
  IsNumber, 
  IsBoolean, 
  IsOptional, 
  IsMongoId,
  Min,
  Max,
  IsDate
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  originalPrice?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  discountPercent?: number;

  @IsBoolean()
  @IsOptional()
  isOnSale?: boolean;

  @IsString()
  @IsOptional()
  dealTag?: string;

  @IsString()
  image: string;

  @IsMongoId()
  category: string;

  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @IsNumber()
  @IsOptional()
  @Min(0)
  stock?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(5)
  rating?: number;

  @IsNumber()
  @IsOptional()
  @Min(0)
  reviewCount?: number;

  @IsDate()
  @Type(() => Date)
  @IsOptional()
  dealExpiry?: Date;

  


  
}