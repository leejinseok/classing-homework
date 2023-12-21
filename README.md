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
- [ ] 로그인
