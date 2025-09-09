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
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>(config.DB.HOST!),
        port: configService.get<number>(config.DB.PORT!),
        username: configService.get<string>(config.DB.USER!),
        password: configService.get<string>(config.DB.PASSWORD!),
        database: configService.get<string>(config.DB.NAME!),
        entities: [User, movieList],
        synchronize: true,
        ssl: {
          rejectUnauthorized: false,
        },
      }),
      inject: [ConfigService],
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
      .forRoutes(AuthController, MoviesController, UserController);
  }
}
