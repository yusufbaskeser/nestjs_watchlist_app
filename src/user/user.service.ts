import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { validateUserExists } from './user.validations/user.validations';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getProfile(email: string) {
    const user = await this.userRepository.findOne({ where: { email } });
validateUserExists(user);
    return {
      message : 'User profile shown successfully',
      name: user.name,
      email: user.email,
    };
  }

  async updateProfile(
    email: string,
    body: { name?: string; email?: string; password?: string },
  ) {
    const user = await this.userRepository.findOne({ where: { email } });
validateUserExists(user);
    if (body.name) user.name = body.name;
    if (body.email) user.email = body.email;
    if (body.password) {
      const salt = await bcrypt.genSalt();
      user.password = await bcrypt.hash(body.password, salt);
    }

    await this.userRepository.save(user);

    return {
      name: user.name,
      email: user.email,
      message: 'Profile updated successfully',
    };
  }
}
