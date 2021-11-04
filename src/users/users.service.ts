import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { NotFoundError } from 'rxjs';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  //CREATE a User
  create(body:CreateUserDto) {
    const user = this.repo.create({ ...body });
    return this.repo.save(user);
  }

  //FIND a User
  findOne(id: number) {
    return this.repo.findOne(id);
  }

  //FIND all Users
  findAll() {
    return this.repo.find();
  }

  //FIND by Email
  findByEmail(email: string) {
    return this.repo.find({ email });
  }

  //UPDATE a User
  async update(id: number, userData: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException('user not found');

    const newUser = { ...user, ...userData };

    return this.repo.save(newUser);
  }

  //REMOVE a User
  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) throw new NotFoundException('user not found');

    return this.repo.remove(user);
  }
}
