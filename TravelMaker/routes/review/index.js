const express = require('express');
const router = express.Router();

const review = require('./review.js');
router.use('/', review);

module.exports = router;