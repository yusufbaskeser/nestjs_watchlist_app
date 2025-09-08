import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { registerTest } from 'src/auth/test/auth.utils.test/auth.utils';

export async function createListTest(
  app: INestApplication,
  token: string,
  listName = 'test list',
  isPublic = false,
) {
  const res = await request(app.getHttpServer())
    .post('/movies/createList')
    .set('Authorization', `Bearer ${token}`)
    .send({ listName, isPublic })
    .expect(201);

  return res.body;
}

interface MoviePayload {
  movieId: number;
}

export async function addMovieToListTest(
  app: INestApplication,
  token: string,
  listId: number,
  movie: MoviePayload,
) {
  const res = await request(app.getHttpServer())
    .post(`/movies/addToList/${listId}`)
    .set('Authorization', `Bearer ${token}`)
    .send(movie)
    .expect(201);

  return res.body;
}
