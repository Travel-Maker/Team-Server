const express = require('express');
const router = express.Router();

const board = require('./board.js');
router.use('/', board);

module.exports = router;