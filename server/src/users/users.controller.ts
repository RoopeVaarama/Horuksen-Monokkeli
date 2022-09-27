import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { User } from './schemas/user.schema';
import { UsersService } from './users.service';

@Controller("/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/")
  @ApiResponse({ status: 200, description: "All users returned", type: [User]})
  async getUsers(): Promise<User[]> {
    return await this.usersService.getUsers();
  }

  @Post("/")
  @ApiCreatedResponse({ status: 200, description: "New user created", type: User })
  async createUser(@Body() user : User ): Promise<User> {
    return await this.usersService.createUser(user);
  }

  @Patch("/:id")
  @ApiResponse({ status: 200, description: "User updated", type: User})
  async updateUser(@Param("id") id: String, @Body() user: User) {
    return await this.usersService.updateUser(id, user);
  }

  @Delete("/:id")
  @ApiResponse({ status: 200, description: "User deleted", type: Boolean})
  async deleteUser(@Param("id") id: String) {
    return await this.usersService.deleteUser(id);
  }
}
