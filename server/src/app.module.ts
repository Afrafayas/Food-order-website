import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { CartModule } from './cart/cart.module';
import { OrdersModule } from './orders/orders.module';
import { EmailModule } from './email/email.module';
import { PaymentModule } from './payment/payment.module';
import { BannersModule } from './banners/banners.module';
import { ReviewsModule } from './reviews/reviews.module';
import { WishlistModule } from './wishlist/wishlist.module';
import { PromoModule } from './promo/promo.module';
import { OffersModule } from './offers/offers.module';




@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI as string),
    AuthModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
    OrdersModule,
    EmailModule,
    PaymentModule,
    BannersModule,
    ReviewsModule,
    WishlistModule,
    PromoModule,
    OffersModule,
  ],
})
export class AppModule {}