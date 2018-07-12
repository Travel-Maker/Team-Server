const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

//신청서 보기
router.get('/:board_idx', async (req, res) => {
    let board_idx = req.params.board_idx;

    if (!board_idx) {
        res.status(400).send({
            message : "Null Value : board index"
        });
    } else {
        let selectUserNickQuery = 'SELECT user_nick FROM user WHERE user_idx = (SELECT user_idx FROM board WHERE board_idx = ?)';
        let selectUserNickResult = await db.queryParam_Arr(selectUserNickQuery, [board_idx]);

        let selectBoardQuery = 'SELECT * FROM board WHERE board_idx = ?';
        let selectBoardResult = await db.queryParam_Arr(selectBoardQuery, [board_idx]);

        let selectPlanQuery = 'SELECT * FROM plan WHERE board_idx = ?';
        let selectPlanResult = await db.queryParam_Arr(selectPlanQuery, [board_idx]);

        let selectCommentQuery = 'SELECT * FROM comment WHERE board_idx = ? ORDER BY comment_idx DESC';
        let selectCommentResult = await db.queryParam_Arr(selectCommentQuery, [board_idx]);

        let comments = new Array();

        for (var i = 0; i < selectCommentResult.length; i++) {
            let selectUserNickQuery = 'SELECT user_nick FROM user WHERE user_idx = (SELECT user_idx FROM comment WHERE comment_idx = ?)';
            let selectUserNickResult = await db.queryParam_Arr(selectUserNickQuery, [selectCommentResult[i].comment_idx]);

            let comment = {
                "user_info" : selectUserNickResult[0].user_nick,
                "comment_data" : selectCommentResult[i]
            }
            comments[i] = comment;
        }

        if (!selectBoardResult || !selectPlanResult || !selectCommentResult) {
            res.status(500).send({
                message : "Invaild Server Error : select total board date"
            });
        } else {
            res.status(200).send({
                message : "Successfully Get Total Board Data", 
                sender : selectUserNickResult,
                board : selectBoardResult,
                plan : selectPlanResult,
                comment : comments
            });
        }
    }
});

module.exports = router;