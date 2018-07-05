const express = require('express');
const router = express.Router();

const db = require('../../../module/pool.js');
const jwt = require('../../../module/jwt.js');

//북마크 추가 및 삭제
router.post('/', async (req, res) => {
	let token = req.headers.token;
	let decoded = jwt.verify(token);

	let user_idx = decoded.user_idx;
	let country_idx = req.body.country_idx;
	
	let PrintBookmarkQuery = 'SELECT * FROM bookmark_country WHERE country_idx = ? AND user_idx = ?;';
    let PrintBookmark = await db.queryParam_Arr(PrintBookmarkQuery, [country_idx, user_idx]);

	if (!country_idx || !user_idx) {
		res.status(400).send({
			message : "Null Value"
		});
	} else { 
		if (PrintBookmark.length == 1) {
			let DeleteBookmarkQuery = 'DELETE FROM bookmark_country where board_idx = ? AND user_idx = ?;';
			let DeleteBookmark = await db.queryParam_Arr(DeleteBookmarkQuery, [country_idx, user_idx]);

			if (!DeleteBookmark) {
				res.status(500).send({
					message : "Internal Server Error"
				});
			} else {
				res.status(201).send({
					message : "Successful Delete Bookmark Data",
				});
			}
		} else {
        let AddBookmarkQuery = 'INSERT INTO bookmark_country (board_idx, user_idx) VALUES (?, ?)';
		let AddBookmark = await db.queryParam_Arr(AddBookmarkQuery, [country_idx, user_idx]);
		
		if (!AddBookmark) {
			res.status(500).send({
				message : "Internal Server Error"
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
