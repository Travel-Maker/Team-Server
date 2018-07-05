const express = require('express');
const router = express.Router();

const country = require('./country.js');
router.use('/', country);


module.exports = router;