import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { compare } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prismaServise: PrismaService) {}
  async createUser(email: string, passwordHash: string): Promise<User> {
    return this.prismaServise.user.create({
      data: { email, passwordHash },
    });
  }
  async getUser(email: string): Promise<User> {
    return this.prismaServise.user.findUnique({ where: { email } });
  }

  async getUserByEmail(email: string): Promise<User> {
    return this.prismaServise.user.findFirst({ where: { email } });
  }

  async validateUser({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<boolean> {
    const existedUser = await this.getUserByEmail(email);
    if (email !== existedUser?.email) {
      return false;
    }
    const isCorrectPassword = await compare(password, existedUser.passwordHash);
    if (!isCorrectPassword) {
      return false;
    }
    return true;
  }

  async invalidateToken(token: string): Promise<{ id: number; token: string }> {
    return await this.prismaServise.invalidToken.create({ data: { token } });
  }

  async validateToken(token: string): Promise<boolean> {
    const invalidToken = await this.prismaServise.invalidToken.findUnique({
      where: { token },
    });

    if (invalidToken !== null) {
      return false;
    }
    return true;
  }
}
