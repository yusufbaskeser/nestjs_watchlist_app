import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import * as bcrypt from 'bcrypt';
import { config } from '../config/config';
import {
  validateRegister,
  validateLogin,
} from './auth.validations/auth.validations';
import { generateJwtToken } from '../utils/generateJwtToken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async register(name: string, email: string, password: string) {
    await validateRegister(this.usersRepository, name, email, password);
    const hash = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({ name, email, password: hash });
    const savedUser = await this.usersRepository.save(user);
    const payload = {
      name: savedUser.name,
      email: savedUser.email,
      id: savedUser.id,
    };
    const token = generateJwtToken(payload);

    return {
      message: 'User registered successfullly',
      access_token: token,
    };
  }

  async login(email: string, password: string) {
    const user = await validateLogin(this.usersRepository, email, password);

    const payload = { email: user.email, sub: user.id };
    const token = generateJwtToken(payload);

    return {
      message: 'Login successful',
      access_token: token,
    };
  }
}
