const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

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


//신청하기 board 생성 하고, plan 넣기
router.post('/', async (req, res) => {
    let token = req.headers.token;
    let decoded = jwt.verify(token);

    let user_idx = decoded.user_idx;
    let board_title = req.body.board_title;
    let board_city = req.body.board_city;
    let board_dep_time = req.body.board_dep_time;
    let board_arr_time = req.body.board_arr_time;
    let board_content = req.body.board_content;
    let board_status = 0;

    let board_plan = req.body.board_plan;   //plan을 담은 배열
    let country_idx = req.body.country_idx; //나라 상세보기에서 했을 시
    let expert_idx = parseInt(req.body.expert_idx);   //전문가 페이지에서 작성했을시

    console.log(req.body);
    console.log(user_idx);
    

    if (!user_idx || !board_title || !board_city || !board_dep_time || !board_arr_time || !board_content || !board_plan || !country_idx || !expert_idx) {
        res.status(500).send({
            message : "Null Value"
        });
    } else {
        let createBoardQuery = 'INSERT INTO board (country_idx, user_idx, expert_idx, board_title, board_city, board_dep_time, board_arr_time, board_content, board_status) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        let createBoardResult =  await db.queryParam_Arr(createBoardQuery, [country_idx, user_idx, expert_idx, board_title, board_city, board_dep_time, board_arr_time, board_content, board_status]);

        let board_idx = createBoardResult[0].insertId;

        if (!createBoardResult) {
            res.status(500).send({
                message : "Internal Server Error : insert board error"
            });
        } else {
            let ins = board_plan[0].in;
            let acommondations = board_plan
        }
    
    }




});
module.exports = router;