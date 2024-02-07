import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryColumn('varchar', {
    name: 'id',
  })
  id: number;

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true })
  name: string;
}
