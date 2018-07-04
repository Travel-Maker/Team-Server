const express = require('express');
const router = express.Router();

//나라별 북마크
const country = require('./country/index.js');
router.use('/country', country);

//전문가별 북마크
const expert = require('./expert/index.js');
router.use('/expert', expert);


module.exports = router;