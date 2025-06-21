import { Injectable } from '@nestjs/common';
import { User } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findUsers(): Promise<Partial<User>[]>{
    const users = await this.prisma.user.findMany();
    const safeUsers = await Promise.all(users.map((user)=>  this.getSafeUser(user)));
    return safeUsers;
  }

  async findUserById(id: number): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async deleteUserById(id: number) : Promise<Partial<User>> {
    const user = await this.prisma.user.delete({
      where: {
        id
      }
    })
    return this.getSafeUser(user);
  }

  async getSafeUser(user: User): Promise<Partial<User>> {
    const { password, refreshToken, ...safeUser } = user;
    return safeUser;
  }
}
