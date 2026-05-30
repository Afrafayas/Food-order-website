import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) {}

  @Get()
  getWishlist(@Request() req) {
    return this.wishlistService.getWishlist(req.user.id);
  }

  @Post(':productId')
  toggleWishlist(@Request() req, @Param('productId') productId: string) {
    return this.wishlistService.toggleWishlist(req.user.id, productId);
  }

  @Get(':productId/check')
  isInWishlist(@Request() req, @Param('productId') productId: string) {
    return this.wishlistService.isInWishlist(req.user.id, productId);
  }
}