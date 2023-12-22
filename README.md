클래스팅 백엔드 과제 (이진석)

## Overview

## Structure

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

## TODO

- [x] 회원가입
  - [x] 패스워드 해싱
  - [x] 이메일 암호화
- [x] 로그인
  - [x] 토큰 발급
  - [x] 토큰 검증 (AuthGuard)
- [x] .env 파일에 설정 정보 저장
- [x] 모듈 분리 (api, core)
- [ ] 학교페이지
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
  - [x] 학생회원 > 학교페이지 소식 목록 (구독 중인 모든 학교, 최신순)
    - 학교페이지 소식은 구독 시점부터
    - 구독을 취소했다면 구독 취소 시점 이후의 소식은 노출하지 않음

- [ ] 테스트코드
  - [x] root controller 테스트
