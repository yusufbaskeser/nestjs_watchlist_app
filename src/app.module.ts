import {
  Module,
  NestModule,
  MiddlewareConsumer,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { User } from './entities/user.entity';
import { movieList } from './entities/movie.list.entity';

import { tokenCheck } from './middleware/tokenCheck';
import { AuthController } from './auth/auth.controller';
import { UserModule } from './user/user.module';
import { MoviesModule } from './movies/movies.module';
import { MoviesController } from './movies/movies.controller';
import { UserController } from './user/user.controller';
import {config} from './config/config';

@Module({
  imports: [
   
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], 
      useFactory: () => ({
        type: 'postgres',
        host: config.DB.HOST,
        port: config.DB.PORT,
        username: config.DB.USER,
        password: config.DB.PASSWORD,
        database: config.DB.NAME,
        entities: [User, movieList],
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
      inject: [], 
    }),
    AuthModule,
    UserModule,
    MoviesModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(tokenCheck)
      .exclude(
        { path: 'auth/register', method: RequestMethod.POST },
        { path: 'auth/login', method: RequestMethod.POST },
      )
      .forRoutes(MoviesController, UserController);
  }
}
