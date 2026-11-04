
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'node:crypto';
import  request from 'supertest';

import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

describe('Users authorization (HTTP)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;

  const runId = randomUUID();
  const createdEmails: string[] = [];

  beforeAll(async () => {
    if (!process.env.DATABASE_URL?.includes('/relayai_test?')) {
      throw new Error(
        'Refusing to run authorization tests unless DATABASE_URL targets relayai_test.',
      );
    }

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    jwt = app.get(JwtService);
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    if (prisma && createdEmails.length > 0) {
      await prisma.user.deleteMany({
        where: { email: { in: createdEmails } },
      });
    }

    await app?.close();
  });

  async function tokenFor(
    role: 'CUSTOMER' | 'AGENT' | 'ADMIN',
  ): Promise<string> {
    return jwt.signAsync({
      sub: `${runId}-${role.toLowerCase()}`,
      role,
    });
  }

  function agentPayload() {
    const email = `${runId}-agent@example.test`;
    createdEmails.push(email);

    return {
      name: 'Integration Test Agent',
      email,
      password: 'IntegrationPassword123!',
    };
  }

  it('rejects unauthenticated requests to both admin endpoints', async () => {
    await request(app.getHttpServer())
      .get('/api/users')
      .expect(401);

    await request(app.getHttpServer())
      .post('/api/users/agents')
      .send(agentPayload())
      .expect(401);
  });

  it.each(['CUSTOMER', 'AGENT'] as const)(
    'rejects a valid %s token from admin endpoints',
    async (role) => {
      const token = await tokenFor(role);

      await request(app.getHttpServer())
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .expect(403);

      await request(app.getHttpServer())
        .post('/api/users/agents')
        .set('Authorization', `Bearer ${token}`)
        .send(agentPayload())
        .expect(403);
    },
  );

  it('allows an admin token to list users', async () => {
    const token = await tokenFor('ADMIN');

    const response = await request(app.getHttpServer())
      .get('/api/users')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(Array.isArray(response.body)).toBe(true);
  });

  it('allows an admin to create an agent without exposing its password hash', async () => {
    const token = await tokenFor('ADMIN');
    const payload = agentPayload();

    const response = await request(app.getHttpServer())
      .post('/api/users/agents')
      .set('Authorization', `Bearer ${token}`)
      .send(payload)
      .expect(201);

    expect(response.body).toMatchObject({
      name: payload.name,
      email: payload.email,
      role: 'AGENT',
    });

    expect(response.body).not.toHaveProperty('passwordHash');
  });

  it('rejects attempts to register publicly with the ADMIN role', async () => {
    const email = `${runId}-public-admin@example.test`;
    createdEmails.push(email);

    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        name: 'Attempted Admin',
        email,
        password: 'IntegrationPassword123!',
        role: 'ADMIN',
      })
      .expect(400);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    expect(user).toBeNull();
  });

  it('still allows public registration, always as CUSTOMER', async () => {
    const email = `${runId}-customer@example.test`;
    createdEmails.push(email);

    const response = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        name: 'Integration Customer',
        email,
        password: 'IntegrationPassword123!',
      })
      .expect(201);

    expect(response.body.role).toBe('CUSTOMER');
    expect(response.body).not.toHaveProperty('passwordHash');
  });
});
