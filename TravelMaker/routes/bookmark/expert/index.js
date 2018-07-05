const express = require('express');
const router = express.Router();

//전문가 북마크 보기 및 삭제
const bookmark_expert = require('./bookmark_expert.js');
router.use('/', bookmark_expert);

//전문가 북마크 보기
const list = require('./list.js');
router.use('/list', list);

module.exports = router;