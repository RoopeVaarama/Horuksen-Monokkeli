import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';
import { User } from './schemas/user.schema';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Example endpoint
   * http://localhost:3001/admin
   * @todo remove this
   * @returns Admin user
   */
  @Get("/admin")
  @ApiResponse({ status: 200, description: "Admin created or found" })
  async getAdmin(): Promise<User> {
    return await this.appService.getAdmin();
  }

  /**
   * Example endpoint
   * See: http://localhost:3001/api#/default/AppController_createUser
   * @param user 
   * @returns 
   */
  @Post("/user")
  @ApiCreatedResponse({ status: 200, description: "New user created", type: User })
  async createUser(@Body() user : User ): Promise<User> {
    return await this.appService.createUser(user);
  }
}
