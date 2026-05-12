import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './order.schema';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    const order = new this.orderModel({ user: userId, ...createOrderDto });
    return order.save();
  }

  async findAll(): Promise<Order[]> {
    return this.orderModel.find().populate('user').populate('items.product').exec();
  }

  async findUserOrders(userId: string): Promise<Order[]> {
    return this.orderModel.find({ user: userId }).populate('items.product').exec();
  }

  async findOne(id: string): Promise<Order> {
    const order = await this.orderModel.findById(id).populate('items.product');
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, status: string): Promise<Order> {
    const order = await this.orderModel.findByIdAndUpdate(
      id, { status }, { new: true }
    );
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}