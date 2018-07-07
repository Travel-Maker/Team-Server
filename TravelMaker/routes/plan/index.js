const express = require('express');
const router = express.Router();

//계획서 작성 밑 수정
const plan = require('./plan.js');
router.use('/', plan);

//전문가 : 받은 플랜 관리
const receive = require('./receive.js');
router.use('/receive', receive);



module.exports = router;