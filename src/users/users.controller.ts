import { Controller, Delete, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { User } from 'generated/prisma';
import { UsersService } from './users.service';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/roles.enum';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { RolesGuard } from 'src/roles/roles.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService){}


  @Get('')
  async findUsers(){
    return this.usersService.findUsers();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) userId: number): Promise<{message: string, user: Partial<User>}> {
    const deletedUser = await this.usersService.deleteUserById(userId);
    return {
      message: 'Successfully Deleted the User',
      user: deletedUser
    }
  }
}
