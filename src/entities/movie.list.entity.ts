import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class movieList {
  @PrimaryGeneratedColumn()
  listId: number;

  @Column()
  userEmail: string;

  @Column()
  listName: string;

  @Column('integer', { array: true, default: '{}' })
  movies: number[];

  @Column({ default: false })
  isPublic: boolean;
}
