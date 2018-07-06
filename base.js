const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

module.exports = router;


let token = req.headers.token;
	let decoded = jwt.verify(token);

    let user_idx = decoded.user_idx;


// 일반 유저 토큰
//idx 5 : 
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6NSwiaWF0IjoxNTMwODY0NjU0LCJleHAiOjE1MzM0NTY2NTR9.fZzWul9GmEr6PA48KrQuSiV_QKvLsCP9-KyFZJg8ISA
//idx 3 : 
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6MywiaWF0IjoxNTMwODY0ODA2LCJleHAiOjE1MzM0NTY4MDZ9.GyrwFiikzOq7dbiZ33BZ-lh3G0YJQqAucfAYXwdXe7o 

// 전문가 유저 토큰
//idx 13 : 
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6MTMsImlhdCI6MTUzMDgxMTA1MSwiZXhwIjoxNTMzNDAzMDUxfQ.vIWW9kbrYJLrtTRHm2JEFdAYrkrb7e04Q_y_BhxbOyU
//idx 10 : 
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkeCI6MTAsImlhdCI6MTUzMDg2NDc4MSwiZXhwIjoxNTMzNDU2NzgxfQ.5xL3dDuN9fD-9m8qI8QtsghABKX-CjHamZTQiAX0dzE