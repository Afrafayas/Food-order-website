import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Wishlist, WishlistDocument } from './wishlist.schema';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>,
  ) {}

  async getWishlist(userId: string): Promise<Wishlist> {
    let wishlist = await this.wishlistModel
      .findOne({ user: userId })
      .populate('products');
    if (!wishlist) {
      wishlist = new this.wishlistModel({ user: userId, products: [] });
      await wishlist.save();
    }
    return wishlist;
  }

  async toggleWishlist(userId: string, productId: string): Promise<Wishlist> {
    let wishlist = await this.wishlistModel.findOne({ user: userId });
    if (!wishlist) {
      wishlist = new this.wishlistModel({ user: userId, products: [] });
    }

    const index = wishlist.products.findIndex(
      p => p.toString() === productId
    );

    if (index === -1) {
      // Add to wishlist
      wishlist.products.push(productId as any);
    } else {
      // Remove from wishlist
      wishlist.products.splice(index, 1);
    }

    await wishlist.save();
    return wishlist.populate('products');
  }

  async isInWishlist(userId: string, productId: string): Promise<boolean> {
    const wishlist = await this.wishlistModel.findOne({ user: userId });
    if (!wishlist) return false;
    return wishlist.products.some(p => p.toString() === productId);
  }
}