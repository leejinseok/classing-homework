클래스팅 백엔드 과제 (이진석)

## 🏠 Overview

**소감**

주 언어가 spring boot여서 고민이 많았지만 클래스팅에서 표준으로 사용하고 있는 nestjs를 사용해보았는데, spring과 유사한 점이 많아서 개발하는데 크게 어렵지 않았다. nestjs가 최근 우아한형제들에서도 spring과 함께 백엔드 표준으로 자리를 잡았다고 하는데 장점이 많은 것 같았고 이번 기회에 배울 수 있어서 좋은 기회였던거 같다

## 🏛️ Structure

### Api

Auth

- AuthController
- AuthService

SchoolPage

- SchoolPageController
- SchoolPageService

SchoolPageNews

- SchoolPageNewsController
- SchoolPageNewsService

Member

- MemberController
- MemberAuthenticatedController (인증 된 사용자 전용)
- MemberService

### Core

**DB**

SchoolPage

- id
- name
- region

SchoolPageNewsFeed

- id
- schoolPageId
- createdBy
- content

Member

- id
- name
- role (ADMIN, PARENT, STUDENT, TEACHER)

MemberSchoolPageSubscribe

- id
- memberId
- schoolPageId
- subscribedAt
- unsubscribedAt

## 🎢 Tech Stack

- node 21.4.0
- npm 10.2.4
- typescript 5.1.3
- mysql
- swagger
- jsonwebtoken
- jest
- docker

## 🏃 Run Application

**Docker MySQL container load (필수)**

```
docker-compose -f docker/docker-compose-db.yml up -d
```

**test**

```
npm install
npm run test
```

**run**

```shellscript
npm install
npm run start
```

## 👷 TODO

- [x] 회원가입

  - [x] 패스워드 해싱
  - [x] 이메일 암호화

- [x] 로그인

  - [x] 토큰 발급
  - [x] 토큰 검증 (AuthGuard)

- [x] .env 파일에 설정 정보 저장
- [x] 모듈 분리 (api, core)
- [x] 학교페이지

  - [x] 학교페이지 생성
  - [x] 학교페이지 제거
  - [x] 학교페이지 수정

- [x] 학교페이지 > 소식

  - [x] 학교페이지 > 소식 > 생성
  - [x] 학교페이지 > 소식 > 수정
  - [x] 학교페이지 > 소식 > 삭제
  - [x] 학교페이지 > 소식 목록 (최신순)

- [x] 학생회원

  - [x] 학생회원 > 학교페이지 구독
  - [x] 학생회원 > 학교페이지 구독 취소
  - [x] 학생회원 > 학교페이지 목록 (구독중)
  - [x] 학생회원 > 학교페이지 > 소식 목록
    - 소식은 구독 시점부터
    - 구독을 취소해도 구독을 취소하기 이전의 소식은 불러옴

- [ ] 테스트코드

  - [x] root controller 테스트
  - [x] auth controller 테스트
  - [x] auth service 테스트
  - [x] school page controller 테스트
  - [x] school page service 테스트
  - [x] school page news controller 테스트
  - [x] school page news service 테스트
  - [ ] member authenticated controller 테스트
  - [ ] member service 테스트

- [x] swagger 교정

  - api property, operation, validator 추가

- [x] validate pipe 테스트

## 🧾 Memo

뉴스피드 불러오기 Native Query

```sql
select
  schoolPageNews.*,
  schoolPage.school_name,
  memberSchoolPageSubscribe.member_id,
  memberSchoolPageSubscribe.created_at,
  memberSchoolPageSubscribe.unsubscribed_at
from school_page_news schoolPageNews
  inner join school_page schoolPage
    on schoolPage.id = schoolPageNews.school_page_id
  inner join member_school_page_subscribe memberSchoolPageSubscribe
    on memberSchoolPageSubscribe.school_page_id = schoolPageNews.school_page_id
where
  memberSchoolPageSubscribe.member_id = ${memberId}
  and schoolPageNews.created_at >= memberSchoolPageSubscribe.created_at
  and
  (
    memberSchoolPageSubscribe.unsubscribed_at is not null
      and schoolPageNews.created_at <= memberSchoolPageSubscribe.unsubscribed_at
    or
    memberSchoolPageSubscribe.unsubscribed_at is null
  )
```
