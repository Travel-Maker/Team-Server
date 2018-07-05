const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

module.exports = router;


let token = req.headers.token;
	let decoded = jwt.verify(token);

    let user_idx = decoded.user_idx;