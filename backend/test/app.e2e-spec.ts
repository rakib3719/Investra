import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            success: true,
            statusCode: 200,
            message: 'Request completed successfully',
            data: 'Hello World!',
            timestamp: expect.any(String),
          }),
        );
      });
  });

  it('/success (GET)', () => {
    return request(app.getHttpServer())
      .get('/success')
      .expect(200)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            success: true,
            statusCode: 200,
            message: 'User profile retrieved successfully',
            data: {
              id: 1,
              name: 'John Doe',
              email: 'john@example.com',
            },
            timestamp: expect.any(String),
          }),
        );
      });
  });

  it('/error (GET)', () => {
    return request(app.getHttpServer())
      .get('/error')
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            success: false,
            statusCode: 400,
            message: 'This is a bad request sample exception',
            error: 'Bad Request',
            path: '/error',
            timestamp: expect.any(String),
          }),
        );
      });
  });

  it('/validate (POST) - failure with validation error details', () => {
    return request(app.getHttpServer())
      .post('/validate')
      .send({
        name: '',
        email: 'invalid-email',
        password: '123',
      })
      .expect(400)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            success: false,
            statusCode: 400,
            message: 'Validation failed',
            error: 'Bad Request',
            errors: {
              name: 'Name is required',
              email: 'Please provide a valid email address',
              password: 'Password must be at least 6 characters long',
            },
            path: '/validate',
            timestamp: expect.any(String),
          }),
        );
      });
  });

  it('/validate (POST) - success with valid inputs', () => {
    const payload = {
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'strongpassword123',
    };

    return request(app.getHttpServer())
      .post('/validate')
      .send(payload)
      .expect(201)
      .expect((res) => {
        expect(res.body).toEqual(
          expect.objectContaining({
            success: true,
            statusCode: 201,
            message: 'Validation passed successfully',
            data: payload,
            timestamp: expect.any(String),
          }),
        );
      });
  });
});

