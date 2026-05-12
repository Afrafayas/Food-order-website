// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
  
//   app.enableCors();
//   app.useGlobalPipes(new ValidationPipe({
//     whitelist: true,
//     transform: true,
//   }));
//   app.setGlobalPrefix('api');
  
//   const port = process.env.PORT || 5001;
//   await app.listen(port);
//   console.log(`Server running on port ${port}`);
// }
// bootstrap();


import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  
  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT ?? 5001);
  console.log(`Server running on port 5001`);
}
bootstrap();