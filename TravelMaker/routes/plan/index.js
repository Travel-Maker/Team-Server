const express = require('express');
const router = express.Router();

//plan 추가, 수정, 삭제
const plan = require('./plan.js');
router.use('/', plan);

//전문가 : 받은 플랜 관리
const receive = require('./receive.js');
router.use('/receive', receive);

//일정 보기


module.exports = router;