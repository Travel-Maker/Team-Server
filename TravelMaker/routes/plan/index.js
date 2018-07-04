const express = require('express');
const router = express.Router();

//전문가 : 받은 플랜 관리
const receive = require('./receive.js');
router.use('/receive', receive);

//일정 보기


module.exports = router;