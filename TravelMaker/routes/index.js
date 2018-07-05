var express = require('express');
var router = express.Router();

//계정관리 (로그인, 회원가입)
const user = require('./user/index.js');
router.use('/user', user);

//나라 정보화면
// const country = require('./country/index.js');
// router.use('/country', country);

//신청하기 board의 댓글
const comment = require('./comment/index.js');
router.use('/comment', comment);

//후기 보기
const review = require('./review/index.js');
router.use('/review', review);

//신청하기 화면
const board = require('./board/index.js');
router.use('/board', board);

//일정
const plan = require('./plan/index.js');
router.use('/plan', plan);

//일정당 장소
const place = require('./place/index.js');
router.use('/place', place);

//장소의 교통수단
const transportation = require('./transport/index.js');
router.use('/transportation', transportation);

//북마크 (나라별 북마크, 전문가 북마크)
const bookmark = require('./bookmark/index.js');
router.use('/bookmark', bookmark);

const search = require('./search/index.js');
router.use('/search', search);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
