const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

//신청서 보기
router.get('/:board_idx', async (req, res) => {
    let board_idx = req.params.board_idx;

    if (!board_idx) {
        res.status(500).send({
            message : "Null Value : board index"
        });
    } else {
        let selectBoardQuery = 'SELECT * FROM board WHERE board_idx = ?';
        let selectBoardResult = await db.queryParam_Arr(selectBoardQuery, [board_idx]);

        let selectPlanQuery = 'SELECT * FROM plan WHERE board_idx = ?';
        let selectPlanResult = await db.queryParam_Arr(selectPlanQuery, [board_idx]);

        let selectCommentQuery = 'SELECT * FROM comment WHERE board_idx = ?';
        let selectCommentResult = await db.queryParam_Arr(selectCommentQuery, [board_idx]);

        if (!selectBoardResult || !selectPlanResult || !selectCommentResult) {
            res.status(500).send({
                message : "Invaild Server Error : select total board date"
            });
        } else {
            res.status(200).send({
                message : "Successfully Get Total Board Data", 
                board : selectBoardResult,
                plan : selectPlanResult,
                comment : selectCommentResult
            });
        }
    }
});

module.exports = router;