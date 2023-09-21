import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { CreateUserDto } from './user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post('/register')
  async createUser(@Body() userData: CreateUserDto): Promise<User> {
    const saltOrRounds = 3;
    const hashedPassword = await bcrypt.hash(userData.password, saltOrRounds);
    const result = await this.usersService.createUser(
      userData.email,
      hashedPassword,
    );
    return { ...result, passwordHash: undefined };
  }

  signJwt(email: string, secret: string) {
    return new Promise<string>((resolve, reject) => {
      sign(
        { email, iat: Math.floor(Date.now() / 1000) },
        secret,
        { algorithm: 'HS256', expiresIn: '7d' },
        (err, token) => {
          if (err) {
            reject(err);
          }
          resolve(token as string);
        },
      );
    });
  }

  @Post('/login')
  async login(@Body() userData: CreateUserDto): Promise<object> {
    const result = await this.usersService.validateUser(userData);

    if (!result) {
      new HttpException(`Wrong credentials`, HttpStatus.FORBIDDEN);
    }

    const jwt = await this.signJwt(userData.email, process.env.JWT_SECRET);
    return { jwt };
  }
}
