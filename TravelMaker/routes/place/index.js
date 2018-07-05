const express = require('express');
const router = express.Router();

const place = require('./place.js');
router.use('/', place);

module.exports = router;