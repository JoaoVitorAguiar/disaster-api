import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '@core/data/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

describe('OccurencesController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let authToken: any;
  let userId: string;
  let categoryId: string;

  beforeAll(async () => {
    jest.setTimeout(30000);
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    prismaService = moduleFixture.get(PrismaService);

    const hashedPassword = await bcrypt.hash('123456', 10);

    const user = await prismaService.user.create({
      data: {
        name: 'Test admin',
        email: 'adminoccurrences27654@example.com',
        password: hashedPassword,
        role: 'admin',
        cpf: '437974386486',
      },
    });

    userId = user.id;

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'adminoccurrences27654@example.com',
        password: '123456',
      })

    authToken = loginResponse.body.access_token;


    const createCategoryResponse = await prismaService.category.create({
      data: {
        name: "categoria de teste",
        status: "active"
      },
    });
    console.log(createCategoryResponse)

    categoryId = createCategoryResponse.id;
  });

  afterAll(async () => {
    await prismaService.occurrence.deleteMany();
    await prismaService.category.deleteMany();
    await prismaService.user.deleteMany();
    await app.close();
  });

  it('/occurences (POST)', async () => {
    const formData = {
      title: 'Test Occurrence',
      description: 'Occurrence Description',
      zipCode: '12345-678',
      latitude: 12.34,
      longitude: 56.78,
      categoryId: categoryId,
    };

    const response = await request(app.getHttpServer())
      .post('/occurences')
      .set('Authorization', `Bearer ${authToken}`)
      .field(formData)
      .expect(201);

    expect(response.body).toHaveProperty('statusCode', 201);
    expect(response.body).toHaveProperty('message', 'Ocorrência criada com sucesso');
  });

  it('/occurences/:id (PATCH)', async () => {
    const occurrence = await prismaService.occurrence.create({
      data: {
        title: 'Initial Title',
        description: 'Initial Description',
        zipCode: '12345-678',
        latitude: 12.34,
        longitude: 56.78,
        userId: userId,
        categoryId: categoryId,
        files: [],
      },
    });

    const updateData = {
      title: 'Updated Title',
    };

    const response = await request(app.getHttpServer())
      .patch(`/occurences/${occurrence.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send(updateData)
      .expect(200);

    expect(response.body).toHaveProperty('statusCode', 200);
    expect(response.body).toHaveProperty('message', 'Ocorrência atualizada com sucesso');
  });

  it('/occurences (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/occurences')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
  });

  it('/occurences/:id (GET)', async () => {
    const occurrence = await prismaService.occurrence.create({
      data: {
        title: 'Test Occurrence',
        description: 'Occurrence Description',
        zipCode: '12345-678',
        latitude: 12.34,
        longitude: 56.78,
        userId: userId,
        categoryId: categoryId,
        files: [],
      },
    });

    const response = await request(app.getHttpServer())
      .get(`/occurences/${occurrence.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body).toHaveProperty('id', occurrence.id);
  });

  it('/occurences/:id (DELETE)', async () => {
    const occurrence = await prismaService.occurrence.create({
      data: {
        title: 'Test Occurrence',
        description: 'Occurrence Description',
        zipCode: '12345-678',
        latitude: 12.34,
        longitude: 56.78,
        userId: userId,
        categoryId: categoryId,
        files: [],
      },
    });

    await request(app.getHttpServer())
      .delete(`/occurences/${occurrence.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    const deletedOccurrence = await prismaService.occurrence.findUnique({
      where: { id: occurrence.id },
    });

    expect(deletedOccurrence).toBeNull();
  });
});
