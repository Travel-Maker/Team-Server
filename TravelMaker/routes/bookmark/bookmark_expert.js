const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

//북마크 추가 및 삭제
router.post('/', async (req, res) => {
	let token = req.headers.token;
	let decoded = jwt.verify(token);

	let user_idx = decoded.user_idx;
	let expert_idx = req.body.user_idx;
	
	let selectBookmarkQuery = 'SELECT * FROM bookmark_expert WHERE expert_idx = ? AND user_idx = ?;';
	let selectBookmarkResult = await db.queryParam_Arr(selectBookmarkQuery, [expert_idx, user_idx]);

	if (!expert_idx || !user_idx) { 
		res.status(400).send({
			message : "Null Value"
		});
	} else { 
		if (selectBookmarkResult.length == 1) {	//북마크 이미 존재
			let deleteBookmarkQuery = 'DELETE FROM bookmark_expert WHERE expert_idx = ? AND user_idx = ?;';
			let deleteBookmarkResult = await db.queryParam_Arr(deleteBookmarkQuery, [expert_idx, user_idx]);

			if (!deleteBookmarkResult) {
				res.status(500).send({
					message : "Internal Server Error : delete expert bookmark error"
				});
			} else {
				res.status(201).send({
					message : "Successful Delete Bookmark Data",
				});
			}
		} else {	//북마트 존재하지 않음
        let addBookmarkQuery = 'INSERT INTO bookmark_expert (expert_idx, user_idx) VALUES (?, ?)';
		let addBookmarkResult = await db.queryParam_Arr(addBookmarkQuery, [expert_idx, user_idx]);
		
		if (!addBookmarkResult) {
			res.status(500).send({
				message : "Internal Server Error : insert expert bookmark error"
			});
		} else {
			res.status(201).send({
				message : "Successful Add Bookmark Data",
			});
		}
		}	
	}
});

module.exports = router;
