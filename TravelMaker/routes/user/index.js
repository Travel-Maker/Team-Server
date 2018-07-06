const express = require('express');
const router = express.Router();

//mypage 전용
const mypage = require('./mypage.js');
router.use('/mypage', mypage);

//전문가 더보기
const expert = require('./expert.js');
router.use('/expert', expert);

//로그인
const signin = require('./signin.js');
router.use('/signin', signin);

//회원가입
const signup = require('./signup.js');
router.use('/signup', signup);


module.exports = router;