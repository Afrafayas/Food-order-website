import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://food-order-website-plum.vercel.app',
      /\.vercel\.app$/,
    ],
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    transform: true,
  }));
  
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 5001);
  console.log(`Server running on port ${process.env.PORT ?? 5001}`);
}
bootstrap();