import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { registerTest } from 'src/auth/test/auth.utils.test/auth.utils';

export async function createListTest(
  app: INestApplication,
  token: string,
  listName = 'Default Test List',
) {

    
  const res = await request(app.getHttpServer())
    .post('/movies/createList')
    .set('Authorization', `Bearer ${token}`)
    .send({ listName })
    .expect(201);

  return res.body;
}