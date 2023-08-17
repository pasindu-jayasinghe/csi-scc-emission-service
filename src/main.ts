import { HttpService } from '@nestjs/axios';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './log/logging.interceptor';

async function bootstrap() {

  // console.log("__dirname--",__dirname)

  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor(new HttpService()));

  const options = new DocumentBuilder()
    .setTitle('SCC')
    .setDescription('SCC')
    .setVersion('2.0')
    .addTag('SCC')
    .addCookieAuth('optional-session-id')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  app.enableCors();
  await app.listen(7090);
  //await app.listen(3000);

}


bootstrap();
