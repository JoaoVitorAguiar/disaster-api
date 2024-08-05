import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '@core/data/prisma/prisma.service';
import { CampaignStatus } from '@prisma/client';

describe('CampaignsController (e2e)', () => {
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
    await prismaService.campaign.deleteMany();
    const createUserDto = {
        name: 'Admin teste campanha',
        email: 'admin234campanha@example.com',
        password: 'admin1234',
        role: 'admin',
        cpf: '882873888888',
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
    await prismaService.campaign.deleteMany();
    await app.close();
  });

  it('/campaigns (POST)', async () => {
    const createCampaignDto = {
      name: 'Campanha de Teste',
      description: 'Descrição da Campanha de Teste',
      goalAmount: 10000,
      raisedAmount: 5000,
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-12-31'),
      status: CampaignStatus.active,
      latitude: 40.7128,
      longitude: -74.0060,
      qrCode: 'QR_CODE_TEST',
    };

    const response = await request(app.getHttpServer())
      .post('/campaigns')
      .set('Authorization', `Bearer ${authToken}`)
      .send(createCampaignDto)
      .expect(201);

    expect(response.body).toHaveProperty('statusCode', 201);
    expect(response.body).toHaveProperty('message', 'Campanha criada com sucesso');
  });

  it('/campaigns (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/campaigns')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  it('/campaigns/:id (GET)', async () => {
    const campaign = await prismaService.campaign.create({
      data: {
        name: 'Campanha de Teste',
        description: 'Descrição da Campanha de Teste',
        goalAmount: 10000,
        raisedAmount: 5000,
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        status: CampaignStatus.active,
        latitude: 40.7128,
        longitude: -74.0060,
        qrCode: 'QR_CODE_TEST',
      },
    });

    const response = await request(app.getHttpServer())
      .get(`/campaigns/${campaign.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', campaign.id);
  });

  it('/campaigns/:id (PUT)', async () => {
    const campaign = await prismaService.campaign.create({
      data: {
        name: 'Campanha de Teste',
        description: 'Descrição da Campanha de Teste',
        goalAmount: 10000,
        raisedAmount: 5000,
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        status: CampaignStatus.active,
        latitude: 40.7128,
        longitude: -74.0060,
        qrCode: 'QR_CODE_TEST',
      },
    });

    const updateCampaignDto = {
      name: 'Campanha Atualizada',
    };

    const response = await request(app.getHttpServer())
      .put(`/campaigns/${campaign.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateCampaignDto)
      .expect(200);

    expect(response.body).toHaveProperty('statusCode', 200);
    expect(response.body).toHaveProperty('message', 'Campanha atualizada com sucesso');

    const updatedCampaign = await prismaService.campaign.findUnique({
      where: { id: campaign.id },
    });

    expect(updatedCampaign.name).toBe(updateCampaignDto.name);
  });

  it('/campaigns/:id (DELETE)', async () => {
    const campaign = await prismaService.campaign.create({
      data: {
        name: 'Campanha de Teste',
        description: 'Descrição da Campanha de Teste',
        goalAmount: 10000,
        raisedAmount: 5000,
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        status: CampaignStatus.active,
        latitude: 40.7128,
        longitude: -74.0060,
        qrCode: 'QR_CODE_TEST',
      },
    });

    await request(app.getHttpServer())
      .delete(`/campaigns/${campaign.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    const deletedCampaign = await prismaService.campaign.findUnique({
      where: { id: campaign.id },
    });

    expect(deletedCampaign).toBeNull();
  });
});
