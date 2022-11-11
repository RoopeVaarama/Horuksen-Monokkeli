import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiCreatedResponse, ApiResponse } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';
import { User, UserDocument } from './user.schema';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly service: UserService,
    ) { }

    @Get()
    @Public()
    @ApiResponse({ status: 200, description: 'All users returned', type: [User] })
    async findAll(): Promise<User[]> {
        return await this.service.findAll();
    }

    @Post()
    @Public()
    @ApiCreatedResponse({ status: 200, description: 'New user created', type: User })
    async create(@Body() user: User): Promise<User> {
        return await this.service.create(user);
    }

    @Put(':id')
    @Public()
    @ApiResponse({ status: 200, description: 'User updated', type: User })
    async update(@Param('id') id: string, @Body() user: User): Promise<User> {
        return await
            this.service.update(id, user);
    }


    @Delete('/:id')
    @ApiResponse({ status: 200, description: 'User deleted', type: Boolean })
    async deleteUser(@Param('id') id: string) {
        return await this.service.deleteUser(id);
    }
}
