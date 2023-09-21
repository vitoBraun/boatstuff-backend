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
  async getUser(userId: number): Promise<User> {
    return this.prismaServise.user.findUnique({ where: { id: userId } });
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
}
