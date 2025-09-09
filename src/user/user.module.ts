import { Module , MiddlewareConsumer } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { tokenCheck } from 'src/middleware/tokenCheck';

@Module({
  imports: [TypeOrmModule.forFeature([User])],

  providers: [UserService],
  controllers: [UserController],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
      consumer.apply(tokenCheck).forRoutes(UserController);
    }
}
