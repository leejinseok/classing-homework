import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { ApiModule } from '../src/api/api.module';
import { API_EXAMPLE } from '../src/api/config/constants';
import {
  LoginRequest,
  SignUpRequest,
} from '../src/api/domain/auth/dto/auth.reqeust';
import { TokenResponse } from '../src/api/domain/auth/dto/auth.response';
import { MemberResponse } from '../src/api/domain/member/dto/member.response';
import {
  SchoolPageNewsRequest,
  SchoolPageNewsUpdateRequest,
} from '../src/api/domain/school-page-news/dto/school-page-news.request';
import { SchoolPageNewsResponse } from '../src/api/domain/school-page-news/dto/school-page-news.response';
import { SchoolPageRequest } from '../src/api/domain/school-page/dto/school-page.request';
import { SchoolPageResponse } from '../src/api/domain/school-page/dto/school-page.response';
import { PageResponse } from '../src/common/dto/page.response';
import { MemberRole } from '../src/core/db/domain/member/member.entity';

describe('ApiModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
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

  let studentAccessToken: string;
  let adminAccessToken: string;

  describe('AuthController (e2e)', () => {
    const basePath = '/api/v1/auth';
    it(`${basePath}/sign-up (POST)`, async () => {
      // 학생가입
      const studentSignUpRequest = new SignUpRequest();
      studentSignUpRequest.email = API_EXAMPLE.STUDENT_EMAIL;
      studentSignUpRequest.name = API_EXAMPLE.STUDENT_NAME;
      studentSignUpRequest.password = API_EXAMPLE.PASSWORD;
      studentSignUpRequest.role = MemberRole.STUDENT;

      await request(app.getHttpServer())
        .post(`${basePath}/sign-up`)
        .send(studentSignUpRequest)
        .expect(HttpStatus.CREATED)
        .then((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.email).toEqual(API_EXAMPLE.STUDENT_EMAIL);
          expect(res.body.name).toEqual(API_EXAMPLE.STUDENT_NAME);
          expect(res.body.role).toEqual(MemberRole.STUDENT);
          expect(res.body.createdAt).toBeDefined();
        });

      // 관리자가입
      const adminSignUpRequest = new SignUpRequest();
      adminSignUpRequest.email = API_EXAMPLE.ADMIN_EMAIL;
      adminSignUpRequest.name = API_EXAMPLE.ADMIN_NAME;
      adminSignUpRequest.password = API_EXAMPLE.PASSWORD;
      adminSignUpRequest.role = MemberRole.ADMIN;

      await request(app.getHttpServer())
        .post(`${basePath}/sign-up`)
        .send(adminSignUpRequest)
        .expect(HttpStatus.CREATED)
        .then((res) => {
          expect(res.body.id).toBeDefined();
          expect(res.body.email).toEqual(API_EXAMPLE.ADMIN_EMAIL);
          expect(res.body.name).toEqual(API_EXAMPLE.ADMIN_NAME);
          expect(res.body.role).toEqual(MemberRole.ADMIN);
          expect(res.body.createdAt).toBeDefined();
        });
    });

    it(`${basePath}/login (POST)`, async () => {
      const studentLoginRequest = new LoginRequest();
      studentLoginRequest.email = API_EXAMPLE.STUDENT_EMAIL;
      studentLoginRequest.password = API_EXAMPLE.PASSWORD;

      // 학생 로그인
      await request(app.getHttpServer())
        .post(`${basePath}/login`)
        .send(studentLoginRequest)
        .expect(HttpStatus.OK)
        .then((res) => {
          const body = res.body as TokenResponse;
          studentAccessToken = body.accessToken;
          expect(body.accessToken).toBeDefined();
          expect(body.refreshToken).toBeDefined();
        });

      //  관리자 로그인
      const adminLoginRequest = new LoginRequest();
      adminLoginRequest.email = API_EXAMPLE.ADMIN_EMAIL;
      adminLoginRequest.password = API_EXAMPLE.PASSWORD;
      await request(app.getHttpServer())
        .post(`${basePath}/login`)
        .send(adminLoginRequest)
        .expect(HttpStatus.OK)
        .then((res) => {
          const body = res.body as TokenResponse;
          adminAccessToken = body.accessToken;
          expect(body.accessToken).toBeDefined();
          expect(body.refreshToken).toBeDefined();
        });
    });
  });

  let schoolPageResponse: SchoolPageResponse;
  describe('SchoolPageController (e2e)', () => {
    const basePath = '/api/v1/school-pages';
    it(`${basePath} (POST)`, async () => {
      const schoolPageRequest = new SchoolPageRequest();
      schoolPageRequest.schoolName = API_EXAMPLE.SCHOOL_NAME;
      schoolPageRequest.region = '서울';
      return request(app.getHttpServer())
        .post(basePath)
        .set('Authorization', 'Bearer ' + adminAccessToken)
        .send(schoolPageRequest)
        .expect(HttpStatus.CREATED)
        .then((res) => {
          schoolPageResponse = res.body as SchoolPageResponse;
          expect(schoolPageResponse.id).toBeDefined();
          expect(schoolPageResponse.schoolName).toEqual(
            schoolPageRequest.schoolName,
          );
          expect(schoolPageResponse.region).toEqual(schoolPageRequest.region);
        });
    });

    it(`${basePath}/:schooPageId (PATCH)`, async () => {
      const schoolPageRequest = new SchoolPageRequest();
      schoolPageRequest.schoolName = '변경된 학교 이름';
      schoolPageRequest.region = '경기도';

      return request(app.getHttpServer())
        .patch(`${basePath}/${schoolPageResponse.id}`)
        .set('Authorization', 'Bearer ' + adminAccessToken)
        .send(schoolPageRequest)
        .expect(HttpStatus.OK)
        .then((res) => {
          const body = res.body as SchoolPageResponse;
          expect(body.id).toEqual(schoolPageResponse.id);
          expect(body.schoolName).toEqual(schoolPageRequest.schoolName);
          expect(body.region).toEqual(schoolPageRequest.region);
          expect(body.createdAt).toBeDefined();
          expect(body.updatedAt).toBeDefined();
        });
    });

    it(`${basePath}/:schoolPageId (DELETE)`, async () => {
      const schoolPageRequest = new SchoolPageRequest();
      schoolPageRequest.schoolName = '삭제할 학교';
      schoolPageRequest.region = '서울';

      let schoolPageId: number;
      await request(app.getHttpServer())
        .post(basePath)
        .set('Authorization', 'Bearer ' + adminAccessToken)
        .send(schoolPageRequest)
        .expect(HttpStatus.CREATED)
        .then((res) => {
          const body = res.body as SchoolPageResponse;
          schoolPageId = body.id;
          expect(body.id).toBeDefined();
          expect(body.schoolName).toEqual(schoolPageRequest.schoolName);
          expect(body.region).toEqual(schoolPageRequest.region);
        });

      await request(app.getHttpServer())
        .delete(`${basePath}/${schoolPageId}`)
        .set('Authorization', 'Bearer ' + adminAccessToken)
        .expect(HttpStatus.OK);
    });
  });

  describe('SchoolPageNewsController (e2e)', () => {
    const basePath = '/api/v1/school-page-news';
    let schoolPageNewsId: number;
    it(`${basePath} (POST)`, async () => {
      const schoolPageNewsRequest = new SchoolPageNewsRequest();
      schoolPageNewsRequest.content = '내용';
      schoolPageNewsRequest.schoolPageId = schoolPageResponse.id;

      return request(app.getHttpServer())
        .post(basePath)
        .set('Authorization', 'Bearer ' + adminAccessToken)
        .send(schoolPageNewsRequest)
        .expect(HttpStatus.CREATED)
        .then((res) => {
          const body = res.body as SchoolPageNewsResponse;
          schoolPageNewsId = body.id;
          expect(body.id).toBeDefined();
          expect(body.content).toEqual(schoolPageNewsRequest.content);
          expect(body.schoolPageId).toEqual(schoolPageNewsRequest.schoolPageId);
          expect(body.createdAt).toBeDefined();
          expect(body.updatedAt).toBeDefined();
        });
    });

    it(`${basePath} (GET)`, async () => {
      const page = 0;
      const pageSize = 10;
      return request(app.getHttpServer())
        .get(`${basePath}?page=${page}&size=${pageSize}`)
        .set('Authorization', 'Bearer ' + adminAccessToken)
        .expect(HttpStatus.OK)
        .then((res) => {
          const body = res.body as PageResponse<SchoolPageNewsResponse>;
          expect(body.page.currentPage).toEqual(page);
          expect(body.page.pageSize).toEqual(pageSize);
          expect(body.page.totalPage).toBeDefined();
          expect(body.page.pageSize).toBeDefined();
        });
    });

    it(`${basePath}/:schoolPageNewsId (PATCH)`, async () => {
      const schoolPageNewsUpdateRequest = new SchoolPageNewsUpdateRequest();
      schoolPageNewsUpdateRequest.content = '변경할 내용';
      return request(app.getHttpServer())
        .patch(`${basePath}/${schoolPageNewsId}`)
        .set('Authorization', 'Bearer ' + adminAccessToken)
        .send(schoolPageNewsUpdateRequest)
        .expect(HttpStatus.OK)
        .then((res) => {
          const body = res.body as SchoolPageNewsResponse;
          expect(body.id).toEqual(schoolPageNewsId);
          expect(body.content).toEqual(schoolPageNewsUpdateRequest.content);
          expect(body.schoolPageId).toBeDefined();
          expect(body.createdAt).toBeDefined();
          expect(body.updatedAt).toBeDefined();
        });
    });

    it(`${basePath}/:schoolPageNews (DELETE)`, async () => {
      const schoolPageNewsRequest = new SchoolPageNewsRequest();
      schoolPageNewsRequest.content = '내용';
      schoolPageNewsRequest.schoolPageId = schoolPageResponse.id;

      let schoolPageNewsId: number;
      await request(app.getHttpServer())
        .post(basePath)
        .set('Authorization', 'Bearer ' + adminAccessToken)
        .send(schoolPageNewsRequest)
        .expect(HttpStatus.CREATED)
        .then((res) => {
          const body = res.body as SchoolPageNewsResponse;
          schoolPageNewsId = body.id;
        });

      await request(app.getHttpServer())
        .delete(`${basePath}/${schoolPageNewsId}`)
        .set('Authorization', 'Bearer ' + adminAccessToken)
        .send(schoolPageNewsRequest)
        .expect(HttpStatus.OK);
    });
  });

  describe('MemberAuthenticatedController (e2e)', () => {
    const basePath = '/api/v1/members/authenticated';
    it(`${basePath}/me (GET)`, async () => {
      return request(app.getHttpServer())
        .get(`${basePath}/me`)
        .set('Authorization', 'Bearer ' + studentAccessToken)
        .expect(HttpStatus.OK)
        .then((res) => {
          const body = res.body as MemberResponse;
          expect(body.id).toBeDefined();
          expect(body.email).toBeDefined();
          expect(body.name).toBeDefined();
          expect(body.role).toBeDefined();
          expect(body.createdAt).toBeDefined();
          expect(body.updatedAt).toBeDefined();
        });
    });

    it(`${basePath}/school-pages/:schoolPageId/subscribe (POST)`, async () => {
      return request(app.getHttpServer())
        .post(`${basePath}/school-pages/${schoolPageResponse.id}/subscribe`)
        .set('Authorization', 'Bearer ' + studentAccessToken)
        .expect(HttpStatus.CREATED);
    });

    it(`${basePath}/school-pages/:schoolPageId/unsubscribe (PATCH)`, async () => {
      return request(app.getHttpServer())
        .patch(`${basePath}/school-pages/${schoolPageResponse.id}/unsubscribe`)
        .set('Authorization', 'Bearer ' + studentAccessToken)
        .expect(HttpStatus.OK);
    });

    it(`${basePath}/school-pages/subscribed (GET)`, async () => {
      const page = 0;
      const pageSize = 10;
      return request(app.getHttpServer())
        .get(
          `${basePath}/school-pages/subscribed?page=${page}&size=${pageSize}`,
        )
        .set('Authorization', 'Bearer ' + studentAccessToken)
        .expect(HttpStatus.OK)
        .then((res) => {
          const schoolPagePageResponse =
            res.body as PageResponse<SchoolPageResponse>;

          expect(schoolPagePageResponse.page.currentPage).toEqual(page);
          expect(schoolPagePageResponse.page.pageSize).toEqual(pageSize);
          expect(schoolPagePageResponse.page.totalCount).toBeDefined();
          expect(schoolPagePageResponse.page.totalPage).toBeDefined();
          expect(schoolPagePageResponse.list.length).toBeGreaterThan(0);
          expect(schoolPagePageResponse.list[0].id).toBeDefined();
          expect(schoolPagePageResponse.list[0].schoolName).toBeDefined();
          expect(schoolPagePageResponse.list[0].region).toBeDefined();
          expect(schoolPagePageResponse.list[0].createdAt).toBeDefined();
          expect(schoolPagePageResponse.list[0].updatedAt).toBeDefined();
        });
    });

    it(`${basePath}/school-page-news (GET)`, async () => {
      const page = 0;
      const pageSize = 10;

      // 학교 구독
      await request(app.getHttpServer())
        .post(`${basePath}/school-pages/${schoolPageResponse.id}/subscribe`)
        .set('Authorization', 'Bearer ' + studentAccessToken)
        .expect(HttpStatus.CREATED);

      // 구독중인 학교페이지에 등록된 뉴스가 없기 때문에 뉴스피드에 아무것도 나오지 않아야 함
      await request(app.getHttpServer())
        .get(`${basePath}/school-page-news?page=${page}&size=${pageSize}`)
        .set('Authorization', 'Bearer ' + studentAccessToken)
        .expect(HttpStatus.OK)
        .then((res) => {
          const body = res.body as PageResponse<SchoolPageNewsResponse>;
          expect(body.list.length).toEqual(0);
        });

      // 신규 뉴스 등록
      const schoolPageNewsRequest = new SchoolPageNewsRequest();
      schoolPageNewsRequest.content = '내용';
      schoolPageNewsRequest.schoolPageId = schoolPageResponse.id;
      await request(app.getHttpServer())
        .post('/api/v1/school-page-news')
        .set('Authorization', 'Bearer ' + adminAccessToken)
        .send(schoolPageNewsRequest)
        .expect(HttpStatus.CREATED);

      // 구독한 학교 페이지에 뉴스가 등록 되었음으로 1건이 뉴스피드에 나와야 함
      await request(app.getHttpServer())
        .get(`${basePath}/school-page-news?page=${page}&size=${pageSize}`)
        .set('Authorization', 'Bearer ' + studentAccessToken)
        .expect(HttpStatus.OK)
        .then((res) => {
          const body = res.body as PageResponse<SchoolPageNewsResponse>;
          expect(body.list.length).toEqual(1);
        });

      // 구독취소
      await request(app.getHttpServer())
        .patch(`${basePath}/school-pages/${schoolPageResponse.id}/unsubscribe`)
        .set('Authorization', 'Bearer ' + studentAccessToken)
        .expect(HttpStatus.OK);

      // 구독을 취소 한 이후에도 구독중일때 받아보았던 뉴스는 타임라인에 나와야 함 (1건)
      await request(app.getHttpServer())
        .get(`${basePath}/school-page-news?page=${page}&size=${pageSize}`)
        .set('Authorization', 'Bearer ' + studentAccessToken)
        .expect(HttpStatus.OK)
        .then((res) => {
          const body = res.body as PageResponse<SchoolPageNewsResponse>;
          expect(body.list.length).toEqual(1);
        });
    }, 100000);
  });
});
