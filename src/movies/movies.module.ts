import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { tokenCheck } from 'src/middleware/tokenCheck';
import { MoviesController } from './movies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { movieList } from '../entities/movie.list.entity';

@Module({
  imports: [TypeOrmModule.forFeature([movieList])],
  providers: [MoviesService],
  controllers: [MoviesController],
})
export class MoviesModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(tokenCheck).forRoutes(MoviesController);
  }
}
