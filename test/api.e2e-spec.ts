import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { ApiModule } from '../src/api/api.module';
import { API_EXAMPLE } from '../src/api/config/constants';
import {
  LoginRequest,
  SignUpRequest,
} from '../src/api/domain/auth/dto/auth.reqeust';
import { MemberRole } from '../src/core/db/domain/member/member.entity';

describe('ApiModule (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ApiModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/hello (GET)', async () => {
    return request(app.getHttpServer())
      .get('/hello')
      .expect(200)
      .expect('hello');
  });

  it('/api/v1/auth/sign-up (POST)', async () => {
    const signUpRequest = new SignUpRequest();
    signUpRequest.email = API_EXAMPLE.STUDENT_EMAIL;
    signUpRequest.name = API_EXAMPLE.STUDENT_NAME;
    signUpRequest.password = API_EXAMPLE.PASSWORD;
    signUpRequest.role = MemberRole.STUDENT;

    return request(app.getHttpServer())
      .post('/api/v1/auth/sign-up')
      .send(signUpRequest)
      .expect(HttpStatus.CREATED)
      .then((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.email).toEqual(API_EXAMPLE.STUDENT_EMAIL);
        expect(res.body.name).toEqual(API_EXAMPLE.STUDENT_NAME);
        expect(res.body.role).toEqual(MemberRole.STUDENT);
        expect(res.body.createdAt).toBeDefined();
      });
  });

  let accessToken;

  it('/api/v1/auth/login (POST)', async () => {
    const loginRequest = new LoginRequest();
    loginRequest.email = API_EXAMPLE.STUDENT_EMAIL;
    loginRequest.password = API_EXAMPLE.PASSWORD;

    return request(app.getHttpServer())
      .post('/api/v1/auth/login')
      .send(loginRequest)
      .expect(HttpStatus.OK)
      .then((res) => {
        accessToken = res.body.accessToken;
        expect(res.body.accessToken).toBeDefined();
        expect(res.body.refreshToken).toBeDefined();
      });
  });

  it('/api/v1/members/authenticated/me (GET)', async () => {
    return request(app.getHttpServer())
      .get('/api/v1/members/authenticated/me')
      .set('Authorization', 'Bearer ' + accessToken)
      .expect(HttpStatus.OK)
      .then((res) => {});
  });
});
