import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const server = createServer(app.getHttpAdapter().getInstance());

  app.useGlobalPipes;
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  const io = new Server(server, {
    cors: { origin: '*' },
  });

  io.on('connection', (socket) => {
    console.log('a user connected');
  });
  await app.listen(Number(process.env.PORT));
}
bootstrap();
