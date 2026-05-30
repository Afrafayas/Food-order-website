import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { Order, OrderDocument } from '../orders/order.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = new this.productModel(createProductDto);
    return product.save();
  }

  async findAll(): Promise<Product[]> {
  // All products fetch:
  const products = await this.productModel
    .find()
    .populate('category')
    .exec();

  // Calculate total quantity sold for each product:
  const orderCounts = await this.orderModel.aggregate([
    { $unwind: '$items' },
    { $group: { 
        _id: '$items.product', 
        count: { $sum: '$items.quantity' } 
    }},
    { $sort: { count: -1 } },
    { $limit: 4 } // Top 4!
  ]);

  // Top 4 product IDs:
  const bestSellerIds = orderCounts.map(o => o._id.toString());

  // Products  Best Seller tag add:
  return products.map(product => {
    const p = product.toObject();
    if (!p.dealTag && bestSellerIds.includes(p._id.toString())) {
      p.dealTag = 'Best Seller';
    }
    return p;
  });
}

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).populate('category');
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, updateData: Partial<CreateProductDto>): Promise<Product> {
    const product = await this.productModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async remove(id: string): Promise<void> {
    await this.productModel.findByIdAndDelete(id);
  }
}   