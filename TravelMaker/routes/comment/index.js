const express = require('express');
const router = express.Router();

//로그인
const comment = require('./comment.js');
router.use('/', comment);

module.exports = router;