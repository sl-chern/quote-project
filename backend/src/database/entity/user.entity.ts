import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { PermissionEntity } from './permission.entity';
import { QuoteEntity } from './quote.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  is_confirmed: boolean;

  @ManyToMany(() => PermissionEntity, permission => permission.users, { cascade: true })
  @JoinTable()
  permissions: Array<PermissionEntity>;

  @OneToMany(() => QuoteEntity, quote => quote.author, { cascade: true })
  quotes: Array<QuoteEntity>;

  @ManyToMany(() => UserEntity, subscriber => subscriber.following)
  @JoinTable()
  subscribers: Array<UserEntity>;

  @ManyToMany(() => UserEntity, following => following.subscribers)
  following: Array<UserEntity>;
}
