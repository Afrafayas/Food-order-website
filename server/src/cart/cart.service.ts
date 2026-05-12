import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './cart-item.schema';
import { AddToCartDto } from './dto/add-to-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
  ) {}

  async getCart(userId: string): Promise<Cart> {
    let cart = await this.cartModel.findOne({ user: userId }).populate('items.product');
    if (!cart) {
      cart = new this.cartModel({ user: userId, items: [], totalPrice: 0 });
      await cart.save();
    }
    return cart;
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto): Promise<Cart> {
    let cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      cart = new this.cartModel({ user: userId, items: [], totalPrice: 0 });
    }
    const existingItem = cart.items.find(
      item => item.product.toString() === addToCartDto.productId
    );
    if (existingItem) {
      existingItem.quantity += addToCartDto.quantity;
    } else {
      cart.items.push({
        product: addToCartDto.productId as any,
        quantity: addToCartDto.quantity,
        price: addToCartDto.price,
      });
    }
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );
    await cart.save();
    return cart.populate('items.product');
  }

  async decreaseQuantity(userId: string, productId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Cart not found');

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex !== -1) {
      if (cart.items[itemIndex].quantity > 1) {
        cart.items[itemIndex].quantity -= 1;
      } else {
        cart.items.splice(itemIndex, 1);
      }
    }

    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );
    await cart.save();
    return cart.populate('items.product');
  }

  async removeFromCart(userId: string, productId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) throw new NotFoundException('Cart not found');
    cart.items = cart.items.filter(
      item => item.product.toString() !== productId
    );
    cart.totalPrice = cart.items.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );
    await cart.save();
    return cart.populate('items.product');
  }

  async clearCart(userId: string): Promise<void> {
    await this.cartModel.findOneAndUpdate(
      { user: userId },
      { items: [], totalPrice: 0 }
    );
  }
}