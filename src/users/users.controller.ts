import { Throttle } from '@nestjs/throttler';
import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  UseGuards,
  Headers,
  Delete,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { CreateUserDto } from './user.dto';
import { AuthGuard } from './auth.guard';

@Throttle({ default: { limit: 3, ttl: 60000 } })
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async createUser(
    @Body() userData: CreateUserDto,
    @Headers('Authorization') authorization: string,
  ): Promise<User> {
    // just little cheatty authguard
    const basicAuth = authorization.split(' ')[1];
    if (!this.basicValidate(basicAuth)) {
      throw new HttpException(`Fuck off`, HttpStatus.FORBIDDEN);
    }
    const saltOrRounds = 3;
    const hashedPassword = await bcrypt.hash(userData.password, saltOrRounds);
    const result = await this.usersService.createUser(
      userData.email,
      hashedPassword,
    );
    return { ...result, passwordHash: undefined };
  }

  @Delete('delete')
  async deleteUser(
    @Body() userData: { email: string },
    @Headers('Authorization') authorization: string,
  ): Promise<User> {
    // just little cheatty authguard
    const basicAuth = authorization.split(' ')[1];
    if (!this.basicValidate(basicAuth)) {
      throw new HttpException(`Fuck off`, HttpStatus.FORBIDDEN);
    }

    return await this.usersService.deleteUserByEmail(userData.email);
  }

  @Post('login')
  async login(@Body() userData: CreateUserDto): Promise<object> {
    const result = await this.usersService.validateUser(userData);

    if (!result) {
      throw new HttpException(`Wrong credentials`, HttpStatus.FORBIDDEN);
    }

    const jwt = await this.signJwt(userData.email, process.env.JWT_SECRET);
    return { jwt };
  }

  @Post('logout')
  async logout(@Headers('Authorization') authorization: string) {
    const token = authorization.split(' ')[1];
    try {
      await this.usersService.invalidateToken(token);
      return { message: 'User logged out' };
    } catch (error) {
      throw new HttpException(`User is already logout`, HttpStatus.FORBIDDEN);
    }
  }

  @Get('list')
  async getUsersList(@Headers('Authorization') authorization: string) {
    // just little cheatty authguard
    const basicAuth = authorization.split(' ')[1];
    if (!this.basicValidate(basicAuth)) {
      throw new HttpException(`Fuck off`, HttpStatus.FORBIDDEN);
    }
    return this.usersService.getUsersList();
  }

  @Get('check')
  @UseGuards(AuthGuard)
  async check() {
    return 'ok';
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

  basicValidate(basic: string) {
    const basicAuthCredentials = btoa(
      `${process.env.ADMIN_USERNAME}:${process.env.ADMIN_PASSWORD}`,
    );
    return basicAuthCredentials === basic;
  }
}
