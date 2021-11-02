import { Entity, Column, PrimaryGeneratedColumn, AfterRemove } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @AfterRemove()
  logRemove() {
    console.log(`user ${this.email} has been removed`);
  }
}
