const express = require('express');
const router = express.Router();

//북마크 추가 및 삭제
const bookmark_country = require('./bookmark_country.js');
router.use('/', bookmark_country);

//북마크 보기
const list = require('./list.js');
router.use('/list', list);


module.exports = router;