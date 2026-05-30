import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Promo, PromoDocument } from './promo.schema';
import { CreatePromoDto } from './dto/create-promo.dto';

@Injectable()
export class PromoService {
  constructor(
    @InjectModel(Promo.name) private promoModel: Model<PromoDocument>,
  ) {}

  async create(createPromoDto: CreatePromoDto): Promise<Promo> {
    const promo = new this.promoModel(createPromoDto);
    return promo.save();
  }

  async findAll(): Promise<Promo[]> {
    return this.promoModel.find().exec();
  }

  async validatePromo(code: string, orderAmount: number): Promise<{
    valid: boolean;
    discountAmount: number;
    message: string;
  }> {
    const promo = await this.promoModel.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    // Not found:
    if (!promo) {
      return { valid: false, discountAmount: 0, message: 'Invalid promo code!' };
    }

    // Expired:
    if (new Date() > promo.expiryDate) {
      return { valid: false, discountAmount: 0, message: 'Promo code expired!' };
    }

    // Usage limit:
    if (promo.usageLimit > 0 && promo.usedCount >= promo.usageLimit) {
      return { valid: false, discountAmount: 0, message: 'Promo code limit reached!' };
    }

    // Minimum order:
    if (promo.minOrderAmount && orderAmount < promo.minOrderAmount) {
      return {
        valid: false,
        discountAmount: 0,
        message: `Minimum order AED ${promo.minOrderAmount} required!`
      };
    }

    // Calculate discount:
    let discountAmount = (orderAmount * promo.discountPercent) / 100;

    // Max discount limit:
    if (promo.maxDiscount && discountAmount > promo.maxDiscount) {
      discountAmount = promo.maxDiscount;
    }

    return {
      valid: true,
      discountAmount: Math.round(discountAmount * 100) / 100,
      message: `${promo.discountPercent}% discount applied! Save AED ${discountAmount}`,
    };
  }

  async applyPromo(code: string): Promise<void> {
    await this.promoModel.findOneAndUpdate(
      { code: code.toUpperCase() },
      { $inc: { usedCount: 1 } }
    );
  }

  async update(id: string, updateData: Partial<CreatePromoDto>): Promise<Promo> {
    const promo = await this.promoModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!promo) throw new NotFoundException('Promo not found');
    return promo;
  }

  async remove(id: string): Promise<void> {
    await this.promoModel.findByIdAndDelete(id);
  }
}