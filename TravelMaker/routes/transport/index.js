const express = require('express');
const router = express.Router();

const transport = require('./transport.js');
router.use('/', transport);

module.exports = router;