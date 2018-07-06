const express = require('express');
const router = express.Router();

//전체 북마크 리스트 보기
const bookmark = require('./bookmark.js');
router.use('/', bookmark);

//나라별 북마크
const country = require('./bookmark_country.js');
router.use('/country', country);

//전문가별 북마크
const expert = require('./bookmark_expert.js');
router.use('/expert', expert);

module.exports = router;