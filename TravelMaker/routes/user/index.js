const express = require('express');
const router = express.Router();

//로그인
const signin = require('./signin.js');
router.use('/signin', signin);

//회원가입
const signup = require('./signup.js');
router.use('/signup', signup);


module.exports = router;