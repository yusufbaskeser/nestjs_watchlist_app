import { Controller, Get, Put, Body, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateProfileDto } from './dto/updateUserProfileDto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('profile')
  async getProfile(@Req() req) {
    return this.userService.getProfile(req.user.email);
  }

  @Put('profile')
  async updateProfile(
    @Req() req, @Body() body: UpdateProfileDto,
  ) {
    return this.userService.updateProfile(req.user.email, body);
  }
}

