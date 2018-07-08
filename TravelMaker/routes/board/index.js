const express = require('express');
const router = express.Router();

//신청서 작성, 수정, 삭제
const board = require('./board.js');
router.use('/', board);

//신청서 검색
const search = require('./search.js');
router.use('/search', search);

//신청서 보기
const detail = require('./detail.js');
router.use('/detail', detail);

module.exports = router;