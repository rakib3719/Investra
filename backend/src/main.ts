import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './common/config/env.config';
import cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(cookieParser());
  
  // Enable CORS using the validated frontend client URL
  const allowedOrigins = [env.FRONTEND_URL, 'http://localhost:3000', 'http://localhost:5173'];
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Investra API')
    .setDescription('The Investra API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addCookieAuth('accessToken')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(env.PORT);
  console.log(`🚀 Server is running on: http://localhost:${env.PORT}`);
  console.log(`📚 Swagger API Docs: http://localhost:${env.PORT}/api/docs`);
}
bootstrap();

