import { IsString, IsNumber, IsMongoId, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsMongoId()
  product: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  comment: string;
}