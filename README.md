클래스팅 백엔드 과제 (이진석)

## Overview

## Structure

### Core

Entity

SchoolPage

- id
- name
- region

SchoolPageNewsFeed

- id
- schoolId
- createdBy
- content

Member

- id
- name
- role (ADMIN, PARENT, STUDENT, TEACHER)

MemberSchoolPageSubscribe

- id
- memberId
- schoolId
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
- [ ] 학교페이지 > 소식
  - [ ] 학교페이지 > 소식 > 생성
  - [ ] 학교페이지 > 소식 > 수정
  - [ ] 학교페이지 > 소식 > 삭제
- [ ] 학생회원 > 학교페이지 구독
- [ ] 학생회원 > 학교페이지 구독 취소
- [ ] 학생회원 > 학교페이지 (구독중) 목록
- [ ] 학생회원 > 학교페이지 > 소식 목록 (최신순)
