import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  const testUser = {
    email: new Date().getTime().toString() + '@test.com',
    password: 'Test123!',
    name: 'Test User',
  };
  let accessToken: string;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should register a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(200);

    expect(response.body.user).toMatchObject({
      email: testUser.email,
      name: testUser.name,
      role: { name: 'teacher' },
    });
    expect(response.body).toHaveProperty('access_token');
    accessToken = response.body.access_token;
  });

  it('should access protected profile route', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/profile')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);

    expect(response.body.user).toMatchObject({
      email: testUser.email,
      name: testUser.name,
      role: { name: 'teacher' },
    });
  });

  it('should login with registered user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      })
      .expect(200);

    expect(response.body.user).toMatchObject({
      email: testUser.email,
      name: testUser.name,
      role: { name: 'teacher' },
    });
    expect(response.body).toHaveProperty('access_token');
    accessToken = response.body.access_token;
  });
});
