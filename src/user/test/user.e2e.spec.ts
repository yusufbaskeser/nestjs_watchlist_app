import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { getRepositoryToken , TypeOrmModule} from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { registerTest } from '../../auth/test/auth.utils.test/auth.utils';
import {config} from '../../config/config'
import { movieList } from 'src/entities/movie.list.entity';

describe('UserController (E2E)', () => {
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

  it('GET /user/profile should show profile succfesfully', async () => {
    const { token } = await registerTest(
      userRepo,
      'yusuf',
      'test123@test.com',
      '12345678',
    );

    const res = await request(app.getHttpServer())
      .get('/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(res.body).not.toEqual({});
    expect(res.body.email).toBe('test123@test.com');
    expect(res.body.name).toBe('yusuf');

    expect(res.body.message).toBeDefined();
    expect(res.body.message).toBe('User profile shown successfully');
  });


  it('GET /user/profile should fail without token ', async () => {
   

    const res = await request(app.getHttpServer())
      .get('/user/profile')
      .expect(401);

    expect(res.body).not.toEqual({});
    expect(res.body.message).toBe('Token missing or invalid')

    expect(res.body.message).toBeDefined();
  });



  it('GET /user/profile  should fail with invalid token', async () => {
   

    const res = await request(app.getHttpServer())
      .get('/user/profile')
      .set('Authorization', `Bearer token123`)
      .expect(401);

    expect(res.body).not.toEqual({});
    expect(res.body.message).toBe('Invalid or expired token')

    expect(res.body.message).toBeDefined();
  });

  it('PUT /user/profile should update user info succesfully', async () => {
    const { token } = await registerTest(
      userRepo,
      'yusuf',
      'yusuf12@test.com',
      'yusuf123',
    );

    const res = await request(app.getHttpServer())
      .put('/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'yusufkral', email: 'kral12@test.com' })
      .expect(200);

    expect(res.body).not.toEqual({});
    expect(res.body.message).toBe('Profile updated successfully');
    expect(res.body.email).toBe('kral12@test.com');
    expect(res.body.name).toBe('yusufkral');
  });

  it('PUT /user/profile should fail when name and email is empty', async () => {
    const { token } = await registerTest(
      userRepo,
      'yusuf',
      'yusuf12@test.com',
      'yusuf123',
    );

    const res = await request(app.getHttpServer())
      .put('/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '', email: '' })
      .expect(400);

    expect(res.body).not.toEqual({});
    expect(res.body.message).toEqual([
      'email must be an email',
    ]);
  });    


  it('PUT /user/profile should fail without token ', async () => {
   

    const res = await request(app.getHttpServer())
      .put('/user/profile')
      .send({ name: 'yusuf123', email: 'yusuf123213@gmail.com' })

      .expect(401);

    expect(res.body).not.toEqual({});
    expect(res.body.message).toBe('Token missing or invalid')

    expect(res.body.message).toBeDefined();
  });

  it('PUT /user/profile should fail with invalid token', async () => {
   

    const res = await request(app.getHttpServer())
      .put('/user/profile')
      .set('Authorization', `Bearer token123`)
      .send({ name: 'yusuf123', email: 'yusuf123213@gmail.com' })
      .expect(401);

    expect(res.body).not.toEqual({});
    expect(res.body.message).toBe('Invalid or expired token')

    expect(res.body.message).toBeDefined();
  });


  });



