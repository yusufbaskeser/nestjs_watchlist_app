import { Injectable, NestMiddleware } from '@nestjs/common';
import { Response, NextFunction, Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from '../config/config';

export interface Requestt extends Request {
  user: any;
}

@Injectable()
export class tokenCheck implements NestMiddleware {
  use(req: Requestt, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Token missing or invalid' });
    }

    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
  }
}
