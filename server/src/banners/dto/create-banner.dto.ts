import { IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class CreateBannerDto {
  @IsString()
  title: string;

  @IsString()
  subtitle: string;

  @IsString()
  image: string;

  @IsString()
  buttonText: string;

  @IsString()
  @IsOptional()
  buttonLink?: string;

  @IsString()
  @IsOptional()
  bgColor?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  order?: number;
}