import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  Session,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';

import { Serialize } from '../interceptors/serialize.interceptor';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { UserLoginDto } from './dtos/user-login.dto';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authservice: AuthService,
  ) {}

  //FIND all users
  @Get('/all')
  findAllUsers() {
    return this.usersService.findAll();
  }

  //Who AM I
  @Get('/whoami')
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  //Post Sign out a user
  @Post('/signout')
  signOut(@Session() session: any) {
    session.userId = null;
  }

  //POST a User
  @Post('/signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authservice.signup(body);
    session.userId = user.id;
    return user;
  }

  @Post('/login')
  async login(@Body() body: UserLoginDto, @Session() session: any) {
    const user = await this.authservice.signin(body);
    session.userId = user.id;
    return user;
  }

  //Find a User
  @Get('/:id')
  findUser(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }

  //FIND by Email
  @Get('')
  findUserByEmail(@Query('email') email: string) {
    console.log('email', email);
    return this.usersService.findByEmail(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
