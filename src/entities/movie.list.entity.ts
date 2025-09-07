import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class movieList {
  @PrimaryGeneratedColumn()
  listId: number;

  @Column()
  userEmail: string;

  @Column()
  listName: string;

  @Column('text', { array: true, default: '{}' })
  movies: string[];
}
