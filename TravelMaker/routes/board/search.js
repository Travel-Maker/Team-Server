const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

router.post('/', async (req, res) => {
    let country_idx = req.body.country_idx;
    let board_city = req.body.city_name;

    console.log(board_city);

    if (!board_city || !country_idx) {
        res.status(500).send({
            message : "Null Value : board city"
        });
    } else {
        let selectBoardQuery = 'SELECT b.board_title, b.board_city, count(*) as comment_count FROM board as b JOIN comment as c ON b.board_idx = c.board_idx WHERE b.country_idx = ? AND b.board_city = ? GROUP BY b.board_title ORDER BY b.board_idx DESC'
        let selectBoardResult = await db.queryParam_Arr(selectBoardQuery, [country_idx, board_city]);

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