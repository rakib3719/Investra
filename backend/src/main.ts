import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './common/config/env.config';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cookieParser());
  
  // Enable CORS using the validated frontend client URL
  app.enableCors({
    origin: env.FRONTEND_URL,
    credentials: true,
  });

  await app.listen(env.PORT);
  console.log(`🚀 Server is running on: http://localhost:${env.PORT}`);
}
bootstrap();

