import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcrypt';

export async function validateRegister(
  userRepo: Repository<User>,
  name: string,
  email: string,
  password: string,
) {
  if (!name || !name.trim()) {
    throw new Error('Name cannot be empty');
  }

  if (!email || !email.trim()) {
    throw new Error('Email cannot be empty');
  }

  if (!password || !password.trim()) {
    throw new Error('Password cannot be empty');
  }

  const existingUser = await userRepo.findOne({ where: { email } });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  const allUsers = await userRepo.find();
  for (let i = 0; i < allUsers.length; i++) {
    const user = allUsers[i];
    const isSame = await bcrypt.compare(password, user.password);
    if (isSame) {
      throw new Error('This password has already been used by another user');
    }
  }
}

export async function validateLogin(
  userRepo: Repository<User>,
  email: string,
  password: string,
) {
  if (!email || !email.trim()) {
    throw new Error('Email cannot be empty');
  }

  if (!password || !password.trim()) {
    throw new Error('Password cannot be empty');
  }

  const user = await userRepo.findOne({ where: { email } });
  if (!user) throw new Error('User not found');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Invalid password');
  return user;
}
