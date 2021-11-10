import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: Partial<UsersService>;
  let authService: Partial<AuthService>;

  beforeEach(async () => {
    usersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'test@gmail.com',
          password: 'test',
        } as User);
      },
      findByEmail: (email: string) => {
        return Promise.resolve({
          id: 1,
          email: 'test@gmail.com',
          password: 'test',
        } as User);
      },
      // remove: () => {},
      // update: (user: User) => {},
    };
    authService = {
      // signIn: () => {},
      // signUp: () => {},
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersService,
        },
        {
          provide: AuthService,
          useValue: authService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
