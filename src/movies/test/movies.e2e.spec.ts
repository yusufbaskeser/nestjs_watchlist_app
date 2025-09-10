import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe , } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { getRepositoryToken , TypeOrmModule} from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { registerTest } from '../../auth/test/auth.utils.test/auth.utils';
import {config} from '../../config/config'
import { movieList

 } from 'src/entities/movie.list.entity';
import {
  createListTest,
  addMovieToListTest,
} from './movies.utils.test/movies.utils';

describe('MoviesController (E2E)', () => {
  let app: INestApplication;
  let userRepo: Repository<User>;


  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: config.DB_DUMMY.HOST,
          port: config.DB_DUMMY.PORT,
          username: config.DB_DUMMY.USER,
          password: config.DB_DUMMY.PASSWORD,
          database: config.DB_DUMMY.NAME,
          entities: [User, movieList],
          synchronize: true,
          ssl: config.DB_DUMMY.SSL ? { rejectUnauthorized: false } : undefined,
        }),
      ],
    }).compile();
  
    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  
    userRepo = moduleFixture.get<Repository<User>>(getRepositoryToken(User));
  });
  
  
  afterEach(async () => {
    await userRepo.clear();
  });

  beforeEach(async () => {
    await userRepo.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  //////// GET movies/SEARCH tests///////

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
  });

  it('GET /movies/searchSoonMovies should show soon movies successfully', async () => {
    const { token } = await registerTest(
      userRepo,
      'yusuf',
      'test12345@test.com',
      '12345678',
    );

    const res = await request(app.getHttpServer())
      .get('/movies/searchSoonMovies')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].title).toBeDefined();
  });


  it('GET /movies/searchPopular should fail without token', async () => {
    const res = await request(app.getHttpServer())
      .get('/movies/searchPopular')
      .expect(401);

    expect(res.body.message).toBe('Token missing or invalid');
  });

  it('GET /movies/searchPopular should fail with invalid token', async () => {
    const res = await request(app.getHttpServer())
      .get('/movies/searchPopular')
      .set('Authorization', `Bearer invalidtoken123`)
      .expect(401);

    expect(res.body.message).toBe('Invalid or expired token');
  });

  it('GET /movies/searchTrending should show Trending movies successfully', async () => {
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
  });

  it('GET /movies/searchTrending should fail without token', async () => {
    const res = await request(app.getHttpServer())
      .get('/movies/searchTrending')
      .expect(401);

    expect(res.body.message).toBe('Token missing or invalid');
  });

  it('GET /movies/searchTrending → should fail with invalid token', async () => {
    const res = await request(app.getHttpServer())
      .get('/movies/searchTrending')
      .set('Authorization', `Bearer invalidtoken123`)
      .expect(401);

    expect(res.body.message).toBe('Invalid or expired token');
  });

  it('GET /movies/searchTopRated should show Top Rated movies successfully', async () => {
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
  });

  it('GET /movies/searchTopRated should fail without token', async () => {
    const res = await request(app.getHttpServer())
      .get('/movies/searchTopRated')
      .expect(401);

    expect(res.body.message).toBe('Token missing or invalid');
  });

  it('GET /movies/searchTopRated should fail with invalid token', async () => {
    const res = await request(app.getHttpServer())
      .get('/movies/searchTopRated')
      .set('Authorization', `Bearer invalidtoken123`)
      .expect(401);

    expect(res.body.message).toBe('Invalid or expired token');
  });

  it('GET /movies/search/:name should show searched movie successfully', async () => {
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
  });

  it('GET /movies/search/:name should fail without token', async () => {
    const res = await request(app.getHttpServer())
      .get('/movies/search/Avatar')
      .expect(401);

    expect(res.body.message).toBe('Token missing or invalid');
  });

  it('GET /movies/search/:name should fail with invalid token', async () => {
    const res = await request(app.getHttpServer())
      .get('/movies/search/Avatar')
      .set('Authorization', `Bearer invalidtoken123`)
      .expect(401);

    expect(res.body.message).toBe('Invalid or expired token');
  });

  /////// /movies/publicLists tests /////

  it('GET /movies/publicLists should show public lists all of the users', async () => {
    const { token } = await registerTest(
      userRepo,
      'yusuf',
      'test12345@test.com',
      '12345678',
    );

    const list = await createListTest(
      app,
      token,
      'Yusufun Public Listesi',
      true,
    );

    const movie = {
      movieId: 123,
    };
    await addMovieToListTest(app, token, list.listId, movie);

    const res = await request(app.getHttpServer())
      .get('/movies/publicLists')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('GET /movies/publicLists should fail without token', async () => {
    const res = await request(app.getHttpServer())
      .get('/movies/publicLists')
      .expect(401);

    expect(res.body.message).toBe('Token missing or invalid');
  });

  it('GET /movies/publicLists should fail with invalid token', async () => {
    const res = await request(app.getHttpServer())
      .get('/movies/publicLists')
      .set('Authorization', `Bearer invalidtoken123`)
      .expect(401);

    expect(res.body.message).toBe('Invalid or expired token');
  });

  /////// GET /movies/userFavorites tests //////

  it('GET /movies/userFavorites should get user favorites successfully', async () => {
    const { token } = await registerTest(
      userRepo,
      'yusuf',
      'testyusuf123@test.com',
      '12345678',
    );

    const res = await request(app.getHttpServer())
      .get('/movies/userFavorites')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).toBeInstanceOf(Array);
  });

  it('GET /movies/userFavorites should fail without token', async () => {
    const res = await request(app.getHttpServer())
      .get('/movies/userFavorites')
      .expect(401);

    expect(res.body.message).toBe('Token missing or invalid');
  });

  it('GET /movies/userFavorites should fail with invalid token', async () => {
    const res = await request(app.getHttpServer())
      .get('/movies/userFavorites')
      .set('Authorization', `Bearer invalidtoken123`)
      .expect(401);

    expect(res.body.message).toBe('Invalid or expired token');
  });

  //// POST /movies/creaList tests /////

  it('POST /movies/createList should create a public list successfully', async () => {
    const { token } = await registerTest(
      userRepo,
      'yusuf',
      'test12345@test.com',
      '12345678',
    );

    const res = await request(app.getHttpServer())
      .post('/movies/createList')
      .set('Authorization', `Bearer ${token}`)
      .send({ listName: 'Yusufun Public List', isPublic: true })
      .expect(201);

    expect(res.body).toBeDefined();
    expect(res.body.listName).toBe('Yusufun Public List');
    expect(res.body.isPublic).toBe(true);
  });

  it('POST /movies/createList should create a private list successfully', async () => {
    const { token } = await registerTest(
      userRepo,
      'yusuf',
      'test12345@test.com',
      '12345678',
    );

    const res = await request(app.getHttpServer())
      .post('/movies/createList')
      .set('Authorization', `Bearer ${token}`)
      .send({ listName: 'Yusufun Private List', isPublic: false })
      .expect(201);

    expect(res.body).toBeDefined();
    expect(res.body.listName).toBe('Yusufun Private List');
    expect(res.body.isPublic).toBe(false);
  });

  it('POST /movies/createList should fail if listName is not providad', async () => {
    const { token } = await registerTest(
      userRepo,
      'yusuf',
      'test12345@test.com',
      '12345678',
    );

    const res = await request(app.getHttpServer())
      .post('/movies/createList')
      .set('Authorization', `Bearer ${token}`)
      .send({ isPublic: true })
      .expect(400);

    expect(res.body.message).toEqual(
      expect.arrayContaining([
        'listName must be a string',
        'listName should not be empty',
      ]),
    );
  });

  it('POST /movies/createList should fail without token', async () => {
    const res = await request(app.getHttpServer())
      .post('/movies/createList')
      .send({ listName: 'My List', isPublic: true })
      .expect(401);

    expect(res.body.message).toBe('Token missing or invalid');
  });

  it('POST /movies/createList should fail with invalid token', async () => {
    const res = await request(app.getHttpServer())
      .post('/movies/createList')
      .set('Authorization', `Bearer invalidtoken123`)
      .send({ listName: 'My List', isPublic: true })
      .expect(401);

    expect(res.body.message).toBe('Invalid or expired token');
  });

  ///// POST /movies/addToList/:listId tests//////

  it('POST /movies/addToList/:listId should add movie successfully', async () => {
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
      .send({ movieId: 27205 })
      .expect(201);

    expect(res.body).not.toEqual({});
    expect(res.body.userEmail).toBe('test12343125@test.com');
    expect(res.body.movies.length).toBeGreaterThan(0);
    expect(res.body.movies[0]).toBe(27205);
  });

  it('POST /movies/addToList/:listId  should fail if no token is provided', async () => {
    const { token } = await registerTest(
      userRepo,
      'yusuf',
      'test1@test.com',
      '12345678',
    );
    const list = await createListTest(app, token, 'No Token List');

    const res = await request(app.getHttpServer())
      .post(`/movies/addToList/${list.id}`)
      .send({ movieId: 1 })
      .expect(401);

    expect(res.body).not.toEqual({});
    expect(res.body.message).toBeDefined();
    expect(res.body.message).toContain('Token missing or invalid');
  });

  it('POST /movies/addToList/:listId  should fail if token is expired or invalid', async () => {
    const { token } = await registerTest(
      userRepo,
      'yusuf',
      'test2@test.com',
      '12345678',
    );
    const list = await createListTest(app, token, 'ExpiredToken List');

    const res = await request(app.getHttpServer())
      .post(`/movies/addToList/${list.id}`)
      .set('Authorization', 'Bearer expiredToken')
      .send({ movieId: 1 })
      .expect(401);

    expect(res.body).not.toEqual({});
    expect(res.body.message).toBeDefined();
    expect(res.body.message).toBe('Invalid or expired token');
  });

  it('POST /movies/addToList/:listId should fail if movieId is empty', async () => {
    const { token } = await registerTest(
      userRepo,
      'yusuf',
      'test3@test.com',
      '12345678',
    );
    const list = await createListTest(app, token, 'Empty MovieId List');

    const res = await request(app.getHttpServer())
      .post(`/movies/addToList/${list.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({})
      .expect(400);

    expect(res.body).not.toEqual({});
    expect(res.body.message).toBeDefined();
    expect(res.body.message).toEqual([
      'movieId must be a number conforming to the specified constraints',
      'movieId should not be empty',
    ]);
  });

  it('POST /movies/addToList/:listId should fail if listId does not exist', async () => {
    const { token } = await registerTest(
      userRepo,
      'yusuf',
      'test4@test.com',
      '12345678',
    );

    const res = await request(app.getHttpServer())
      .post(`/movies/addToList/999999`)
      .set('Authorization', `Bearer ${token}`)
      .send({ movieId: 1 })
      .expect(404);

    expect(res.body).not.toEqual({});
    expect(res.body.message).toBeDefined();
    expect(res.body.message).toBe('List not found');
  });


  /////PUT changeList/:listId tests//////
  it('PUT /movies/changeList/:listId  should change listname and isPublic successfully', async()=>{
    const { token } = await registerTest(
      userRepo,
      'yusuf',
      'test4@test.com',
      '12345678',
    );

    const list = await createListTest(app, token, 'Change List' , false);


    const res = await request(app.getHttpServer())
    .put('/user/profile')
    .set('Authorization', `Bearer ${token}`)
    .send({ listName: 'yusufkral', isPublic: true })
    .expect(200);

  })

  it('POST /movies/changeList/:listId should fail if listId does not exist', async () => {
    const { token } = await registerTest(
      userRepo,
      'yusuf',
      'test4@test.com',
      '12345678',
    );

    const res = await request(app.getHttpServer())
      .post(`/movies/addToList/999999`)
      .set('Authorization', `Bearer ${token}`)
      .send({ movieId: 1 })
      .expect(404);

    expect(res.body).not.toEqual({});
    expect(res.body.message).toBeDefined();
    expect(res.body.message).toBe('List not found');
  });


  it('PUT /movies/changeList/:listId  should fail if no token is provided', async()=>{
    const { token } = await registerTest(
      userRepo,
      'yusuf',
      'test4@test.com',
      '12345678',
    );

    const list = await createListTest(app, token, 'Change List' , false);


    const res = await request(app.getHttpServer())
    .put('/user/profile')
    .send({ listName: 'yusufkral', isPublic: true })
    .expect(401);


    expect(res.body).not.toEqual({});
    expect(res.body.message).toBeDefined();
    expect(res.body.message).toContain('Token missing or invalid');

  })

  it('PUT /movies/changeList/:listId  should fail if token is expired or invalid', async()=>{
    const { token } = await registerTest(
      userRepo,
      'yusuf',
      'test4@test.com',
      '12345678',
    );

    const list = await createListTest(app, token, 'Change List' , false);


    const res = await request(app.getHttpServer())
    .put('/user/profile')
    .set('Authorization', 'Bearer expiredToken')

    .send({ listName: 'yusufkral', isPublic: true })
    .expect(401);

    expect(res.body).not.toEqual({});
    expect(res.body.message).toBeDefined();
    expect(res.body.message).toBe('Invalid or expired token');

  })

///// delete /movies/deleteList/:listId tests/////

it('DELETE /movies/deleteList/:listId should delete list successfully', async()=>{
  const { token } = await registerTest(
      userRepo,
      'yusuf',
      'test4@test.com',
      '12345678',
    );
    const list = await createListTest(app, token, 'Delete List', false);
    const res = await request(app.getHttpServer())
    .delete(`/movies/deleteList/${list.listId}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

    expect(res.body).toBeDefined();
    expect(res.body.message).toBe('list deleted successfully');

})



it('DELETE /movies/deleteList/:listId should fail if listId does not exist', async()=>{
  const { token } = await registerTest(
      userRepo,
      'yusuf',
      'test4@test.com',
      '12345678',
    );


    const res = await request(app.getHttpServer())
    .delete('/movies/deleteList/999999')
    .set('Authorization', `Bearer ${token}`)
    .expect(404);

    expect(res.body).toBeDefined();
    expect(res.body.message).toBe('List not found');

})

it('DELETE /movies/deleteList/:listId should fail if no token is provided', async()=>{
 

    const res = await request(app.getHttpServer())
    .delete('/movies/deleteList/999999')
    .expect(401);

    expect(res.body).toBeDefined();
    expect(res.body.message).toBe('Token missing or invalid');

})

it('DELETE /movies/deleteList/:listId should fail if token is expired or invalid', async()=>{
 

  const res = await request(app.getHttpServer())
  .delete('/movies/deleteList/999999')
  .set('Authorization', 'Bearer expiredToken')
  .expect(401);

  expect(res.body).toBeDefined();
  expect(res.body.message).toBe('Invalid or expired token');

})



////// delete /removeMovieFromList/:listId/:movieId tests /////

it('DELETE /movies/removeMovieFromList/:listId/:movieId should remove movie from list successfully', async()=>{
  const { token } = await registerTest(
    userRepo,
    'yusuf',
    'test4@test.com',
    '12345678',
  );
  const list = await createListTest(app, token, 'Remove Movie List', false);

  await addMovieToListTest(app, token, list.listId, {movieId : 27205});

  const res = await request(app.getHttpServer())
  .delete(`/movies/removeMovieFromList/${list.listId}/27205`)
  .set('Authorization', `Bearer ${token}`)
  .expect(200);

  expect(res.body).toBeDefined();
  expect(res.body.movies).toBeInstanceOf(Array);

  
})













});









