import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class movieList {
  @PrimaryGeneratedColumn()
  listId: number;

  @Column()
  userEmail: string;

  @Column()
  listName: string;

  @Column({ default: '' })
  movies: string[];
}
