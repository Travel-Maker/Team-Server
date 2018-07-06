const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

//신청하기 더보기
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

//신청하기 글 삭제
router.delete('/', async (req, res) =>{ 
    let board_idx = req.body.board_idx;

    if (!board_idx) {
        res.status(500).send({
            message : "Null Value : board index"
        });
    } else {
        let deleteBoardQuery = 'DELETE FROM board WHERE board_idx =?';
        //board_idx에 해당하는 모든 일정, 교통, 숙박을 지워야함
        let deleteBoardResult = await db.queryParam_Arr(deleteBoardQuery, board_idx);

        if (!deleteBoardResult) {
            res.status(500).send({
                message : "Internal Server Error : board delete error"
            });

        } else {
            res.status(201).send({
                message : "Successfully Delete Board Data"
            });
        }     
    }
});

module.exports = router;