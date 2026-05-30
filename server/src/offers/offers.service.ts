import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Offer, OfferDocument } from './offer.schema';
import { CreateOfferDto } from './dto/create-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectModel(Offer.name) private offerModel: Model<OfferDocument>,
  ) {}

  async create(createOfferDto: CreateOfferDto): Promise<Offer> {
    const offer = new this.offerModel(createOfferDto);
    return offer.save();
  }

  async findAll(): Promise<Offer[]> {
    return this.offerModel.find().exec();
  }

  // Active offer now check:
  async getActiveOffer(): Promise<{
    hasOffer: boolean;
    offer: Offer | null;
    timeLeft: string;
  }> {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const offers = await this.offerModel.find({ isActive: true, everyday: true });

    for (const offer of offers) {
      if (currentTime >= offer.startTime && currentTime <= offer.endTime) {
        // Calculate time left:
        const [endHour, endMin] = offer.endTime.split(':').map(Number);
        const endDate = new Date();
        endDate.setHours(endHour, endMin, 0);
        
        const diff = endDate.getTime() - now.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        const timeLeft = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

        return { hasOffer: true, offer, timeLeft };
      }
    }

    return { hasOffer: false, offer: null, timeLeft: '00:00:00' };
  }

  async update(id: string, updateData: Partial<CreateOfferDto>): Promise<Offer> {
    const offer = await this.offerModel.findByIdAndUpdate(id, updateData, { new: true });
    if (!offer) throw new NotFoundException('Offer not found');
    return offer;
  }

  async remove(id: string): Promise<void> {
    await this.offerModel.findByIdAndDelete(id);
  }
}