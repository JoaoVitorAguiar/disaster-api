import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { PrismaService } from '@core/data/prisma/prisma.service';
import { AppModule } from '../../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authToken: string;

  beforeAll(async () => {
    jest.setTimeout(30000);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaService = moduleFixture.get(PrismaService);
    await prismaService.user.deleteMany();

    const createUserDto = {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin1234',
      role: 'admin',
      cpf: '00000000000',
      address: {
        street: 'Admin Street',
        city: 'Admin City',
        state: 'Admin State',
        country: 'Admin Country',
        zipCode: '00000-000',
      },
    };

    await request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201);

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: createUserDto.email, password: createUserDto.password })
      .expect(201);

    authToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await prismaService.user.deleteMany();
    await app.close();
  });

  it('/users (POST)', async () => {
    const createUserDto = {
      "name": "John Doe",
      "email": "teste@gmail.com",
      "password": "123456",
      "role": "admin",
      "cpf": "12345678901",
      "address": {
        "street": "teste",
        "city": "Springfield",
        "state": "IL",
        "country": "USA",
        "zipCode": "62704",
      }
    };

    const response = await request(app.getHttpServer())
      .post('/users')
      .set('Authorization', `Bearer ${authToken}`)
      .send(createUserDto)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe(createUserDto.email);
  });

  it('/users (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/users')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  it('/users/:id (GET)', async () => {
    const user = await prismaService.user.create({
      data: {
        name: 'Test User',
        email: 'test1@example.com',
        password: 'password1234',
        role: 'client',
        cpf: '12345678906',
      },
    });

    const response = await request(app.getHttpServer())
      .get(`/users/${user.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', user.id);
  });

  it('/users/:id (PATCH)', async () => {
    const user = await prismaService.user.create({
      data: {
        name: 'Test User',
        email: 'test2@example.com',
        password: 'password123',
        role: 'client',
        cpf: '12345678902',
      },
    });

    const updateUserDto = {
      name: 'Updated User',
    };

    const response = await request(app.getHttpServer())
      .patch(`/users/${user.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateUserDto)
      .expect(200);

    expect(response.body.name).toBe(updateUserDto.name);
  });

  it('/users/:id (DELETE)', async () => {
    const user = await prismaService.user.create({
      data: {
        name: 'Test User',
        email: 'test3@example.com',
        password: 'password123',
        role: 'client',
        cpf: '12345678903',
      },
    });

    await request(app.getHttpServer()).delete(`/users/${user.id}`).set('Authorization', `Bearer ${authToken}`).expect(200);

    const deletedUser = await prismaService.user.findUnique({
      where: { id: user.id },
    });

    expect(deletedUser).toBeNull();
  });
});
