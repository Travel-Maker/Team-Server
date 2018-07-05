const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

router.get('/:country_idx', async (req, res) => {
    let country_idx = req.params.country_idx;

    if (!country_idx) {
        res.status(500).send({
            message : "Null Value : country_idx"
        });
    } else {
        let selectBoardQuery = 'SELECT * FROM board WHERE country_idx = ? ORDER BY board_idx DESC'
        let selectBoardResult = await db.queryParam_Arr(selectBoardQuery, [country_idx]);

        if (!selectBoardResult) {
            res.status(500).send({
                message : "Internal Server Error : Select Board"
            });
        } else {
            res.status(200).send({
                message : "Successfully Get Board",
                boardData : selectBoardResult
            });
        }
    }
});

module.exports = router;