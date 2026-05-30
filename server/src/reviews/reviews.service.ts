import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { Product, ProductDocument } from '../products/product.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(userId: string, createReviewDto: CreateReviewDto): Promise<Review> {
    // Already reviewed check
    const existing = await this.reviewModel.findOne({
      user: userId,
      product: createReviewDto.product,
    });
    if (existing) throw new BadRequestException('Already reviewed this product!');

    // Review create
    const review = new this.reviewModel({
      user: userId,
      ...createReviewDto,
    });
    await review.save();

    // Product rating update
    await this.updateProductRating(createReviewDto.product);

    return review.populate('user', 'name');
  }

  async findByProduct(productId: string): Promise<Review[]> {
    return this.reviewModel
      .find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  async remove(id: string, userId: string): Promise<void> {
    const review = await this.reviewModel.findById(id);
    if (!review) throw new NotFoundException('Review not found');
    if (review.user.toString() !== userId) {
      throw new BadRequestException('Not your review!');
    }
    await this.reviewModel.findByIdAndDelete(id);
    await this.updateProductRating(review.product.toString());
  }

  // Product rating auto update
  private async updateProductRating(productId: string): Promise<void> {
    const reviews = await this.reviewModel.find({ product: productId });
    
    if (reviews.length === 0) {
      await this.productModel.findByIdAndUpdate(productId, {
        rating: 0,
        reviewCount: 0,
      });
      return;
    }

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    
    await this.productModel.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    });
  }
}