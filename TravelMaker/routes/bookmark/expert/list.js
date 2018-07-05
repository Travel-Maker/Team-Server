const express = require('express');
const router = express.Router();

const async = require('async');
const db = require('../../../module/pool.js');

router.post('/', async (req, res) => {
    let user_idx = req.params.user_idx;

    if (!usr_idx) {
        res.status(403).send({
            message : "No user_idx input"
        });
    } else {
        let selectEBookmarkQuery = 'SELECT u.* FROM user as u JOIN bookmark_expert as bme ON bme.expert_idx = u.user_idx WHERE bme.user_idx = ?';
        let selectEBookmark = await db.queryParam_Arr(selectEBookmarkQuery, [user_idx]);

        if (!selectEBookmark) {
            res.status(500).send({
                message : "Internal Server Error"
            });
        } else {
            res.status(200).send({
                message : "Successfully Select ExpertBookmarkList Data",
                data : selectEBookmark
            });
        }
    }
});

module.exports = router;
