const express =require('express');
const router = express.Router();

const db = require('../../../module/pool.js');
const jwt = require('../../../module/jwt.js');

router.post('/', async(req, res) => {
    let token = req.headers.token;
    let decoded = jwt.verify(token);

    console.log(decoded);

    let user_idx = decoded.user_idx;
    let expert_idx = req.body.expert_idx;

    if (!user_idx || !expert_idx) {
        res.status(400).send({
            message : "Null Value"
        });
    } else {
        let addEBookmarkQuery = 'INSERT INTO bookmark_expert ( user_idx, expert_idx )';
        let addEBookmark = await db.queryParam_Arr(addEBookmarkQuery, [user_idx, expert_idx]);

        if (!addEBookmark) {
            res.status(500).send({
                message : "Internal Server Error : Add Bookmark"
            });
        } else {
            res.status(201).send({
                message : "Successfully Add Bookmark",
                data : addEBookmark
            });
        }
    }
});

router.delete('/', async(req, res) => {
    let bookmark_expert_idx = req.body.bookmark_expert_idx;

    let selectEBookmarkQuery = 'SELECT bookmark_expert_idx WHERE bookmark_expert_idx = ?';
    let selectEBookmark = await db.queryParam_Arr(selectEBookmarkQuery, [bookmark_expert_idx]);

    if (!selectEBookmark) {
        res.status(500).send({
            message : "Internal Server Error : Select Bookmark"
        });
    } else if (selectEBookmark.length == 1) {
        let deleteEBookmarkQuery = 'DELETE FROM bookmark_expert WHERE bookmark_expert_idx = ?';
        let deleteEBookmark = await db.queryParam_Arr(deleteEBookmarkQuery, [bookmark_expert_idx]);

        if (!deleteEBookmark) {
            res.status(500).send({
                message: "Internal Server Error : Delete Bookmark"
            });
        } else {
            res.status(201).send({
                message : "Successfully Delete Bookmark"
            });
        }
    }
});

module.exports = router;