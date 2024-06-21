import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { HttpExceptionFilter } from 'src/graphql/filters/http.exeption.filter';
const gql = '/graphql';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe(gql, () => {
    describe('auth', () => {
      it('mutation registration', async () => {
        const res = await request(app.getHttpServer())
          .post(gql)
          .send({
            query: `mutation {
              registration(registrationInput: {email: "3@gmail.com", name: "lesha", password: "qwerty"}) {
                name
                permissions {
                  name
                }
              }
            }`,
          });
        expect(res.status).toBe(200);
        expect(res.body.data.registration.name).toEqual('lesha');
      });

      it('query login (correct password)', async () => {
        const res = await request(app.getHttpServer())
          .post(gql)
          .send({
            query: `query {
              login(loginInput: {email: "3@gmail.com", password: "qwerty"}) {
                accessToken,
                refreshToken,
                userInfo {
                  name
                  permissions {
                    name
                  }
                }
              }
            }`,
          });
        expect(res.status).toBe(200);
        expect(res.body.data.login.userInfo.name).toEqual('lesha');
      });

      it('query login (nonexistent user)', async () => {
        const res = await request(app.getHttpServer())
          .post(gql)
          .send({
            query: `query {
              login(loginInput: {email: "1@gmail.com", password: "qwerty"}) {
                accessToken,
                refreshToken
              }
            }`,
          });
        expect(res.status).toBe(200);
        expect(res.body.errors[0].message).toEqual('User does not exist');
      });

      it('query login (incorrect password)', async () => {
        const res = await request(app.getHttpServer())
          .post(gql)
          .send({
            query: `query {
              login(loginInput: {email: "3@gmail.com", password: "qwert"}) {
                accessToken,
                refreshToken
              }
            }`,
          });
        expect(res.status).toBe(200);
        expect(res.body.errors[0].message).toEqual('Incorrect password');
      });
    });
  });
});
