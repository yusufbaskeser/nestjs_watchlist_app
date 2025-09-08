import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { generateJwtToken } from 'src/utils/generateJwtToken';

export async function registerTest(
  usersRepository: Repository<User>,
  name: string,
  email: string,
  password: string,
) {
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = usersRepository.create({
    name,
    email,
    password: hashedPassword,
  });

  const savedUser = await usersRepository.save(newUser);

  const payload = {
    id: savedUser.id,
    name: savedUser.name,
    email: savedUser.email,
  };

  const token = generateJwtToken(payload);

  return {
    message: 'User registered',
    token,
  };
}
