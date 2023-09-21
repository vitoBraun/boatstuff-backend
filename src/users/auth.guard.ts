import { HttpException } from '@nestjs/common/exceptions/http.exception';
import {
  HttpStatus,
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';

import * as jwt from 'jsonwebtoken';
import { UsersService } from './users.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const token = req.headers.authorization?.split(' ')[1];

    const isTokenValid = await this.userService.validateToken(token);

    if (!isTokenValid) {
      throw new HttpException('Token is expired', HttpStatus.UNAUTHORIZED);
    }

    let email;
    if (token) {
      await jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (payload) {
          email = typeof payload == 'string' ? payload : payload.email;
        }
      });
    }
    if (!email) {
      throw new HttpException('Bad token', HttpStatus.UNAUTHORIZED);
    }
    const user = this.userService.getUser(email);

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.UNAUTHORIZED);
    }

    req.user = user;
    return true;
  }
}
