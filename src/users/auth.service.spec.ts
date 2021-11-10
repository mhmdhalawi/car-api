import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: Partial<UsersService>;
  beforeEach(async () => {
    const users: User[] = [];
    // create a fake copy of the users service
    usersService = {
      findByEmail: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers[0]);
      },
      create: (body: CreateUserDto) => {
        const user = { id: Math.floor(Math.random() * 99999), ...body } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();
    authService = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(authService).toBeDefined();
  });

  it(`checks if user's email is correctly returned`, () => {
    authService
      .signup({ email: 'test@gmail.com', password: '1234' } as CreateUserDto)
      .then((user) => {
        expect(user.email).toEqual('test@gmail.com');
      })
      .catch((err) => {
        console.log('error', err);
      });
  });
  it('creates a new user with salted and hashed password', async () => {
    const user = await authService.signup({
      email: 'test@gmail.com',
      password: '1234',
    } as CreateUserDto);
    expect(user.password).not.toEqual('1234');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if it finds an already existing user', async () => {
    await authService.signup({ email: 'a', password: 'a' } as CreateUserDto);
    expect.assertions(2);
    try {
      await authService.signup({
        email: 'a',
        password: '1234',
      } as CreateUserDto);
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message).toBe('User already exists');
    }
  });

  it('throws an error if no email is found for signing in', (done) => {
    authService
      .signin({ email: 'a', password: '1234' } as CreateUserDto)
      .catch((err) => {
        done();
      });
  });

  it('throws if an invalid password is provided', async () => {
    await authService.signup({ email: 'a', password: '123' } as CreateUserDto);

    expect.assertions(1);
    try {
      await authService.signin({
        email: 'a',
        password: '1234',
      } as CreateUserDto);
    } catch (err) {
      expect(err.message).toBe('Invalid password');
    }
  });

  it('returns a user if correct password is provided', async () => {
    await authService.signup({ email: 'a', password: '1234' } as CreateUserDto);
    authService
      .signin({ email: 'a', password: '1234' } as CreateUserDto)
      .then((user) => {
        expect(user).toBeDefined();
      })
      .catch((err) => {
        console.log('error', err);
      });
  });
});
