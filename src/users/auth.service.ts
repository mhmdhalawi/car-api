import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserLoginDto } from './dtos/user-login.dto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(body: CreateUserDto) {
    //find user by email
    const user = await this.usersService.findByEmail(body.email);
    if (user.length) {
      throw new BadRequestException('User already exists');
    }

    // Generate random bytes as a salt
    const salt = randomBytes(8).toString('hex');

    // Generate a derived key from the password and salt
    const hash = (await scrypt(body.password, salt, 32)) as Buffer;

    //Join the hash and salt together
    const hashAndSalt = salt + '.' + hash.toString('hex');

    // Create a new user and save it
    const newUser = await this.usersService.create({
      ...body,
      password: hashAndSalt,
    });

    //return the new user
    return newUser;
  }

  async signin(body: UserLoginDto) {
    //find user by email
    const user = await this.usersService.findByEmail(body.email);
    if (!user.length) {
      throw new NotFoundException('User does not exist');
    }

    // Split the hash and salt from the stored hash and salt
    const [salt, storedHash] = user[0].password.split('.');

    // Generate a derived key from the password and salt
    const hash = (await scrypt(body.password, salt, 32)) as Buffer;

    // Compare the derived key with the stored hash
    if (hash.toString('hex') !== storedHash) {
      throw new BadRequestException('Invalid password');
    }
    return user;
  }
}
