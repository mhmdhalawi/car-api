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
      findByEmail: (email) => Promise.resolve({ email } as User),
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
    authService = module.get<AuthService>(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(authService).toBeDefined();
  });
});
