import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UserLoginDto } from './dtos/user-login.dto';

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
          email,
          password: 'test',
        } as User);
      },
      // remove: () => {},
      // update: (user: User) => {},
    };
    authService = {
      signin: (body: UserLoginDto) => {
        return Promise.resolve({ id: 1, ...body } as User);
      },
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

  it('finds a user with the given email', async () => {
    const user = await controller.findUserByEmail('test@gmail.com');
    expect(user.email).toEqual('test@gmail.com');
  });

  it('finds a user based on id', async () => {
    const user = await controller.findUser('1');
    expect(user.id).toEqual(1);
  });

  it('signin updates user session and returns user', async () => {
    const session = {
      userId: -10,
    };
    const user = await controller.login(
      {
        email: 'test@gmail.com',
        password: 'test',
      },
      session,
    );

    expect(user.id).toEqual(1);
    expect(user.email).toEqual('test@gmail.com');
    expect(session.userId).toEqual(1);
  });
});
