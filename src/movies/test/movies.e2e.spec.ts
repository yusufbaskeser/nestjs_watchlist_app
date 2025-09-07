import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { registerTest} from '../../auth/test/auth.utils.test/auth.utils'
import { createListTest } from './movies.utils.test/movies.utils';

describe('MoviesController (E2E)', () => {
  let app: INestApplication;
  let userRepo: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();

    userRepo = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
  });
afterEach(async()=>{
  await userRepo.clear();
})

  beforeEach(async () => {
    await userRepo.clear();
  });

  afterAll(async () => {
    await app.close();
  });


  it('GET /movies/searchPopular → should show popular movies successfully', async () => {
    const { token } = await registerTest(
      userRepo,
      'yusuf',
      'test12345@test.com',
      '12345678',
    );
  
    const res = await request(app.getHttpServer())
      .get('/movies/searchPopular')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].title).toBeDefined();
    expect(typeof res.body[0].title).toBe('string');
  });


  it('GET /movies/searchTrending → should show Trending movies successfully', async () => {
    const { token } = await registerTest(
      userRepo,
      'yusuf',
      'test12345@test.com',
      '12345678',
    );
  
    const res = await request(app.getHttpServer())
      .get('/movies/searchTrending')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].title).toBeDefined();
    expect(typeof res.body[0].title).toBe('string');
  });


  it('GET /movies/searchTopRated → should show Top Rated movies successfully', async () => {
    const { token } = await registerTest(
      userRepo,
      'yusuf',
      'test12345@test.com',
      '12345678',
    );
  
    const res = await request(app.getHttpServer())
      .get('/movies/searchTopRated')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].title).toBeDefined();
    expect(typeof res.body[0].title).toBe('string');
  });
  

  it('GET /movies/search/:name → should show searched movie successfully', async () => {
    const { token } = await registerTest(
      userRepo,
      'yusuf',
      'test12345@test.com',
      '12345678',
    );
  
    const res = await request(app.getHttpServer())
      .get('/movies/search/Avatar')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
  
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].title).toBeDefined();
    expect(typeof res.body[0].title).toBe('string');
  });

  it('POST /movies/createList → should create list successfully', async () => {
    const { token } = await registerTest(
      userRepo,
      'yusuf',
      'test12345@test.com',
      '12345678',
    );
  
    const res = await request(app.getHttpServer())
    .post('/movies/createList')
    .set('Authorization', `Bearer ${token}`)
    .send({ listName : 'yusufun favorileri'})
    .expect(201);
  
    expect(res.body).not.toEqual({});
    expect(res.body.userEmail).toBe('test12345@test.com');
    expect(res.body.listName).toBe('yusufun favorileri');
    expect(res.body.movies).toBeInstanceOf(Array);
    expect(res.body.movies.length).toBe(0);
  });


  it('POST /movies/createList should fail without token', async () => {
    const res = await request(app.getHttpServer())
      .post('/movies/createList')
      .send({ listName: 'yusufun favorileri' })
      .expect(401);

    expect(res.body.message).toContain('Token missing or invalid');
  });


  it('POST /movies/createList should fail with invalid token', async () => {
    const res = await request(app.getHttpServer())
      .post('/movies/createList')
      .set('Authorization', `Bearer invalidtoken123`)
      .send({ listName: 'yusufun favorileri' })
      .expect(401);

    expect(res.body.message).toContain('Invalid or expired token');
  });


  //////////////7

 

  it('POST /movies/addToList/:listId → should add movie successfully', async () => {
    const { token } = await registerTest(
      userRepo,
      'yusuf',
      'test12343125@test.com',
      '12345678',   
    );

    const list = await createListTest(app, token, 'Yusufun Listesi');
        

    const res = await request(app.getHttpServer())
      .post(`/movies/addToList/${list.listId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ movieId: '1' })
      .expect(201);

  expect(res.body).not.toEqual({});                 
  expect(res.body.userEmail).toBe('test12343125@test.com'); 
  expect(res.body.movies.length).toBeGreaterThan(0); 
  expect(res.body.movies[0]).toBe('1');  
  });


  it('POST /movies/addToList/:listId  should fail if no token is provided', async () => {
    const { token } = await registerTest(userRepo, 'yusuf', 'test1@test.com', '12345678');
    const list = await createListTest(app, token, 'No Token List');

    const res = await request(app.getHttpServer())
      .post(`/movies/addToList/${list.id}`)
      .send({ movieId: '1' })
      .expect(401);

    expect(res.body).not.toEqual({});
    expect(res.body.message).toBeDefined();
    expect(res.body.message).toContain('Token missing or invalid');
  });

  it('should fail if token is expired or invalid', async () => {
    const { token } = await registerTest(userRepo, 'yusuf', 'test2@test.com', '12345678');
    const list = await createListTest(app, token, 'ExpiredToken List');

    const res = await request(app.getHttpServer())
      .post(`/movies/addToList/${list.id}`)
      .set('Authorization', 'Bearer expired_or_invalid_token')
      .send({ movieId: '1' })
      .expect(401);

    expect(res.body).not.toEqual({});
    expect(res.body.message).toBeDefined();
    expect(res.body.message).toContain('Invalid');
  });


  it('should fail if movieId is empty', async () => {
    const { token } = await registerTest(userRepo, 'yusuf', 'test3@test.com', '12345678');
    const list = await createListTest(app, token, 'Empty MovieId List');

    const res = await request(app.getHttpServer())
      .post(`/movies/addToList/${list.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ movieId: '' })
      .expect(400);

    expect(res.body).not.toEqual({});
    expect(res.body.message).toBeDefined();
    expect(res.body.message).toContain('movieId should not be empty');
  });

  it('should fail if listId does not exist', async () => {
    const { token } = await registerTest(userRepo, 'yusuf', 'test4@test.com', '12345678');

    const res = await request(app.getHttpServer())
      .post(`/movies/addToList/999999`)
      .set('Authorization', `Bearer ${token}`)
      .send({ movieId: '1' })
      .expect(404);

    expect(res.body).not.toEqual({});
    expect(res.body.message).toBeDefined();
    expect(res.body.message).toContain('List not found');
  });

  

  




})