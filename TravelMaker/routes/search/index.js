var express = require('express');
var router = express.Router();


const search = require('./search.js');
router.use('/', search);

module.exports = router;
