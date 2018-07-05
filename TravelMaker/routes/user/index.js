const express = require('express');
const router = express.Router();

//전문가 더보기
const user = require('./user.js');
router.use('/', user);

//로그인
const signin = require('./signin.js');
router.use('/signin', signin);

//회원가입
const signup = require('./signup.js');
router.use('/signup', signup);


module.exports = router;