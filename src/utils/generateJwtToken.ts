import { JwtService } from '@nestjs/jwt';
import { config } from '../config/config';

export function generateJwtToken(payload: object): string {
  const jwtService = new JwtService({
    secret: config.JWT_SECRET,
    signOptions: { expiresIn: '7d' },
  });

  return jwtService.sign(payload);
}
