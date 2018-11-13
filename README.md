# Project : Travel Maker Server

* 2018 SOPT 22기 APPJAM Project

![mainImage](https://drive.google.com/open?id=10yJiNdyOzKrrxff9ypI6FsFlui6Ko31K)



## Description

- 여행 초보자의 취향에 맞는 여행 계획을 전문가가 직접 작성할 수 있는 **트레블 메이커**
- 누구든 여행 전문가가 되어보고, 나만의 여행 전문가를 직접 찾아 특별한 자유 여행 계획을 받아볼 수 있는 여행 플랫폼

* 프로젝트 기간 : 2018년 7월 1일 ~ 2018년 7월 14일
* **API** : https://docs.google.com/spreadsheets/d/1WHFWTYAIN2pG8ryjXd5YpnzEmGBkmBmCmiZTb0Iivuk/edit?usp=sharing



## DB

* 논리적 DB 모델링

* MySQL

  * ERD

  ![ERD](https://drive.google.com/open?id=154ObISmK5Iitv2owfkWvBIYlEjIogm_a)




## 의존성

```json
"dependencies": {
	"async": "^2.6.1",
	"aws-sdk": "^2.269.1",
	"cookie-parser": "^1.4.3",
	"debug": "^2.6.9",
	"express": "^4.16.3",
	"helmet": "^3.12.1",
	"http-errors": "^1.6.3",
	"jade": "^1.11.0",
	"jsonwebtoken": "^8.3.0",
	"moment": "^2.22.2",
	"morgan": "^1.9.0",
	"multer": "^1.3.1",
	"multer-s3": "^2.7.0",
	"promise-mysql": "^3.3.1"
}} 
​```
```

## 시작하기

모든 소스코드는 visual studio + Window 10 + Node.js 8 환경에서 작성되었습니다.

* Node.js의 Async/Await을 사용해 (Promise) 비동기 제어를 하고 있습니다.
* Node.js의 버전을 7.6 이상으로 유지해햐 합니다.



## 배포

- AWS EC2 - 애플리케이션 서버
- AWS RDS - db 서버
- AWS S3 - 저장소 서버



## 사용된 도구

- [Node.js](https://nodejs.org/ko/) - Chrome V8 자바스크립트 엔진으로 빌드된 자바스크립트 런타임
- [Express.js](http://expressjs.com/ko/) - Node.js 웹 애플리케이션 프레임워크
- [NPM](https://rometools.github.io/rome/) - 자바 스크립트 패키지 관리자
- [PM2](http://pm2.keymetrics.io/) - Express 앱용 프로세스 관리자
- [vscode](https://code.visualstudio.com/) - 편집기
- [Mysql](https://www.mysql.com/) - DataBase
- [AWS EC2](https://aws.amazon.com/ko/ec2/?sc_channel=PS&sc_campaign=acquisition_KR&sc_publisher=google&sc_medium=english_ec2_b&sc_content=ec2_e&sc_detail=aws%20ec2&sc_category=ec2&sc_segment=177228231544&sc_matchtype=e&sc_country=KR&s_kwcid=AL!4422!3!177228231544!e!!g!!aws%20ec2&ef_id=WkRozwAAAnO-lPWy:20180412120123:s) - 클라우드 환경 컴퓨팅 시스템
- [AWS RDS](https://aws.amazon.com/ko/rds/) - 클라우드 환경 데이터베이스 관리 시스템
- [AWS S3](https://aws.amazon.com/ko/s3/?sc_channel=PS&sc_campaign=acquisition_KR&sc_publisher=google&sc_medium=english_s3_b&sc_content=s3_e&sc_detail=aws%20s3&sc_category=s3&sc_segment=177211245240&sc_matchtype=e&sc_country=KR&s_kwcid=AL!4422!3!177211245240!e!!g!!aws%20s3&ef_id=WkRozwAAAnO-lPWy:20180412120059:s) - 클라우드 환경 데이터 저장소



## 개발자

* **김현진** ([hyunjkluz](https://github.com/hyunjkluz)) : 작성자
* **한선민** ([HanSeonmin](https://github.com/HanSeonmin))



## 연관 프로젝트

* [Android](https://github.com/Travel-Maker/Team-Android)
* [iOS](https://github.com/Travel-Maker/Team-iOS)
