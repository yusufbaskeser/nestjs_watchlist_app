import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
import { registerTest } from './auth.utils.test/auth.utils';

describe('AuthController (E2E)', () => {
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

  beforeEach(async () => {
    await userRepo.clear();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /auth/register → should register successfully', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: 'yusuf', email: 'yusuf@test.com', password: 'yusuf123' })
      .expect(201);

    expect(res.body).not.toEqual({});
    expect(res.body.message).toBe('User registered successfullly');
    expect(res.body.access_token).toBeDefined();
  });

  it('POST /auth/register → should fail if name and password empty', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ name: '', email: '', password: '' })
      .expect(400);

    expect(res.body).not.toEqual({});
    expect(res.body.message).toBeDefined();
  });

  it('POST /auth/login → should login successfully', async () => {
    await registerTest(userRepo, 'yusuf', 'yusuf@test.com', 'yusuf123');

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'yusuf@test.com', password: 'yusuf123' })
      .expect(201);

    expect(res.body).not.toEqual({});
    expect(res.body.message).toBe('Login successful');
    expect(res.body.access_token).toBeDefined();
  });

  it('POST /auth/login → should fail with wrong email and password', async () => {
    await registerTest(userRepo, 'yusuf', 'yusuf@test.com', 'yusuf123');

    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'yusufbaskeser@test.com', password: '321321' })
      .expect(401);

    expect(res.body).not.toEqual({});
    expect(res.body.message).toBe('User not found');
  });

  it('POST /auth/login → should fail if email and password is empty', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: '', password: '' })
      .expect(400);

    expect(res.body).not.toEqual({});
    expect(res.body.message).toEqual([
      'email must be an email',
      'password should not be empty',
    ]);  });
});
