import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wishlist, WishlistDocument } from './wishlist.schema';
import { Product, ProductDocument } from '../products/product.schema';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async getWishlist(userId: string) {
    const wishlist = await this.wishlistModel.findOne({ user: userId }).lean();
    if (!wishlist) {
      await this.wishlistModel.create({ user: userId, products: [] });
      return { products: [] };
    }
    const products = await this.productModel
      .find({ _id: { $in: wishlist.products } })
      .populate('category')
      .lean();
    return { ...wishlist, products };
  }

  async toggleWishlist(userId: string, productId: string) {
    let wishlist = await this.wishlistModel.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new this.wishlistModel({ user: userId, products: [] });
    }

    const index = wishlist.products.findIndex(
      p => p.toString() === productId
    );

    if (index === -1) {
      wishlist.products.push(productId as any);
    } else {
      wishlist.products.splice(index, 1);
    }

    await wishlist.save();

    const updatedWishlist = await this.wishlistModel.findById(wishlist._id).lean();
    if (!updatedWishlist) return { products: [] };
    const products = await this.productModel
      .find({ _id: { $in: updatedWishlist.products } })
      .populate('category')
      .lean();
    return { ...updatedWishlist, products };
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const wishlist = await this.wishlistModel.findOne({ user: userId });
    if (!wishlist) return false;
    return wishlist.products.some(p => p.toString() === productId);
  }
}
