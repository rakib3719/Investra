import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { env } from './common/config/env.config';
import cookieParser from 'cookie-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const expressApp = app.getHttpAdapter().getInstance() as express.Express;
  expressApp.disable('x-powered-by');
  if (env.NODE_ENV === 'production') {
    expressApp.set('trust proxy', 1);
  }

  app.use(cookieParser());
  app.use('/uploads', express.static(env.UPLOADS_DIR, {
    fallthrough: false,
    index: false,
    maxAge: '1d',
  }));
  
  // Enable CORS using the validated frontend client URL
  app.enableCors({
    origin: env.TRUSTED_ORIGINS,
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
