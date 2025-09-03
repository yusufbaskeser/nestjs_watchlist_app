import { Controller, Get, Put, Body, Req } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  async getProfile(@Req() req) {
    return this.userService.getProfile(req.user.email);
  }

  @Put('profile')
  async updateProfile(
    @Req() req, @Body() body: { name?: string; email?: string; password?: string },
  ) {
    return this.userService.updateProfile(req.user.email, body);
  }
}

//validations u tamamla
//movies endpointleri yaz ve apı key ile fetch isteği at arr kullan
//testleri yaz
//userMovies tablosu oluştur foreign key ile user tablosuna bağla
