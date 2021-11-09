import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let authService: AuthService;
  beforeEach(async () => {
    // create a fake copy of the users service
    const usersService: Partial<UsersService> = {
      findByEmail: () => Promise.resolve({} as User),
      create: (body: CreateUserDto) =>
        Promise.resolve({ id: 1, ...body } as User),
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
});
