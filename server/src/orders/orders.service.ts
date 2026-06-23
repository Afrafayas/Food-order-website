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

  private calculateDelivery(lat: number, lng: number): { fee: number; time: number } {
    const restaurantLat = 24.4539;
    const restaurantLng = 54.3773;
    const R = 6371;
    const dLat = (lat - restaurantLat) * Math.PI / 180;
    const dLng = (lng - restaurantLng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(restaurantLat * Math.PI/180) * Math.cos(lat * Math.PI/180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    
    let fee = 5;
    if (distance > 15) fee = 20;
    else if (distance > 7) fee = 15;
    else if (distance > 3) fee = 10;
    
    const time = Math.round(distance * 3) + 10;
    return { fee, time };
  }

  getDeliveryDetails(lat: number, lng: number) {
    const { fee, time } = this.calculateDelivery(lat, lng);
    const restaurantLat = 24.4539;
    const restaurantLng = 54.3773;
    const R = 6371;
    const dLat = (lat - restaurantLat) * Math.PI / 180;
    const dLng = (lng - restaurantLng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(restaurantLat * Math.PI/180) * Math.cos(lat * Math.PI/180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return { fee, estimatedTime: time, distance };
  }

  async create(userId: string, createOrderDto: CreateOrderDto): Promise<Order> {
    let deliveryFee = createOrderDto.deliveryFee ?? 5;
    let estimatedDeliveryTime = createOrderDto.estimatedDeliveryTime ?? 30;

    if (
      createOrderDto.deliveryLat !== undefined &&
      createOrderDto.deliveryLng !== undefined &&
      createOrderDto.deliveryLat !== null &&
      createOrderDto.deliveryLng !== null
    ) {
      const { fee, time } = this.calculateDelivery(createOrderDto.deliveryLat, createOrderDto.deliveryLng);
      deliveryFee = fee;
      estimatedDeliveryTime = time;
    }

    const order = new this.orderModel({
      user: userId,
      ...createOrderDto,
      deliveryFee,
      estimatedDeliveryTime,
    });
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