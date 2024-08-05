import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '@core/data/prisma/prisma.service';
import { Role } from '@prisma/client';

describe('AddressesController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authToken: string;
  let userId: string;

  beforeAll(async () => {
    jest.setTimeout(30000);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaService = moduleFixture.get(PrismaService);
    
    await prismaService.address.deleteMany();

    const createUserDto = {
        name: 'teste user',
        email: 'addresses@example.com',
        password: '123456',
        role: 'admin',
        cpf: '999038299999',
        address: {
          street: 'Admin Street',
          city: 'Admin City',
          state: 'Admin State',
          country: 'Admin Country',
          zipCode: '00000-000',
        },
      };

  
      const user = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);
      userId = user.body.id;
  
      const loginResponse = await request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: createUserDto.email, password: createUserDto.password })
        .expect(201);
  
      authToken = loginResponse.body.access_token;
  });

  afterAll(async () => {
    await prismaService.address.deleteMany();
    await app.close();
  });

  it('/addresses (POST)', async () => {
    const createUserDto = {
      street: '123 Main St',
      city: 'Springfield',
      state: 'IL',
      country: 'USA',
      zipCode: '62704',
      userId: userId 
    };

    const response = await request(app.getHttpServer())
      .post('/addresses')
      .set('Authorization', `Bearer ${authToken}`)
      .send(createUserDto)
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.street).toBe(createUserDto.street);
  });

  it('/addresses/:id (GET)', async () => {

    const response = await request(app.getHttpServer())
      .get(`/addresses/${userId}`)      
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('userId', userId);
  });

  it('/addresses/:id (PATCH)', async () => {
    const address = await prismaService.address.create({
      data: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        country: 'USA',
        zipCode: '62704',
        userId: userId 
      },
    });

    const updateAddressDto = {
      street: '456 Elm St',
    };

    const response = await request(app.getHttpServer())
      .patch(`/addresses/${address.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateAddressDto)
      .expect(200);

    expect(response.body.street).toBe(updateAddressDto.street);
  });

  it('/addresses/:id (DELETE)', async () => {
    const address = await prismaService.address.create({
      data: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        country: 'USA',
        zipCode: '62704',
        userId: userId
      },
    });

    await request(app.getHttpServer()).delete(`/addresses/${address.id}`).set('Authorization', `Bearer ${authToken}`).expect(200);

    const deletedAddress = await prismaService.address.findUnique({
      where: { id: address.id },
    });

    expect(deletedAddress).toBeNull();
  });
});
