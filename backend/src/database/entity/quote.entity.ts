import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'quotes' })
export class QuoteEntity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
  })
  id: string;

  @Column({ type: 'varchar' })
  text: string;

  @Column({ type: 'varchar' })
  history: string;

  @ManyToOne(() => UserEntity, author => author.quotes)
  author: UserEntity;
}
