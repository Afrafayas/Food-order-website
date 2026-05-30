import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Banner, BannerDocument } from './banner.schema';
import { CreateBannerDto } from './dto/create-banner.dto';

@Injectable()
export class BannersService {
  constructor(
    @InjectModel(Banner.name) private bannerModel: Model<BannerDocument>,
  ) {}

  async create(createBannerDto: CreateBannerDto): Promise<Banner> {
    const banner = new this.bannerModel(createBannerDto);
    return banner.save();
  }

  async findAll(): Promise<Banner[]> {
    return this.bannerModel
      .find({ isActive: true })
      .sort({ order: 1 })
      .exec();
  }

  async findAllAdmin(): Promise<Banner[]> {
    return this.bannerModel.find().sort({ order: 1 }).exec();
  }

  async update(id: string, updateData: Partial<CreateBannerDto>): Promise<Banner> {
    const banner = await this.bannerModel.findByIdAndUpdate(
      id, updateData, { new: true }
    );
    if (!banner) throw new NotFoundException('Banner not found');
    return banner;
  }

  async remove(id: string): Promise<void> {
    await this.bannerModel.findByIdAndDelete(id);
  }

  async toggleActive(id: string): Promise<Banner> {
    const banner = await this.bannerModel.findById(id);
    if (!banner) throw new NotFoundException('Banner not found');
    banner.isActive = !banner.isActive;
    return banner.save();
  }
}