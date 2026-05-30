import { IsString, IsNumber, IsBoolean, IsOptional } from 'class-validator';

export class CreateOfferDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  startTime: string;

  @IsString()
  endTime: string;

  @IsNumber()
  discountPercent: number;

  @IsBoolean()
  @IsOptional()
  everyday?: boolean;

  @IsString()
  @IsOptional()
  color?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}