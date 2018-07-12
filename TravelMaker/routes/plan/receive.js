const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

//받은 플랜 관리
router.post('/', async (req, res) => {
    let token = req.headers.token;
	let decoded = jwt.verify(token);

    let user_idx = decoded.user_idx;

    console.log("expert_idx : " + user_idx);
    
    let selectPlanQuery = 'SELECT board_idx, board_title, board_status FROM board WHERE expert_idx = ? ORDER BY board_idx DESC';
    let selectPlanResult = await db.queryParam_Arr(selectPlanQuery, [user_idx]);

    let receiveBoards = new Array();

    if (!selectPlanResult) {
        res.status(500).send({
            'message' : "Internal Server Error : select error"
        });
    } else {
        for (var i = 0; i < selectPlanResult.length; i++) {
            let selectUserNickQuery = 'SELECT user_nick FROM user WHERE user_idx = (SELECT user_idx FROM board WHERE board_idx = ?)';
            let selectUserNickResult = await db.queryParam_Arr(selectUserNickQuery, [selectPlanResult[i].board_idx]);

            if (!selectUserNickResult) {
                res.status(500).send({
                    message : "Invaild Server Error : select nickname error"
                });
            } else {
                let board = {
                    "user_nick" : selectUserNickResult[0].user_nick,
                    "board_data" : selectPlanResult[i]
                }

                receiveBoards[i] = board;  
            } 
        }
        res.status(200).send({
            message : "Successful Get Board Data",
            receive_board : receiveBoards
        });
        
    }
});

//받은 플랜 상세보기
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

        if (!selectBoardResult || !selectPlanResult || !selectUserNickResult) {
            res.status(500).send({
                message : "Invaild Server Error : select total board date"
            });
        } else {
            res.status(200).send({
                message : "Successfully Get Total Board Data", 
                sender : selectUserNickResult,
                board : selectBoardResult,
                plan : selectPlanResult
            });
        }
    }
});

//받은 플랜 수락
router.put('/', async (req, res) => {
    //코인 바꾸고
    //게시글 상태 바꾸기 : 수락(2)
    let token = req.headers.token;
	let decoded = jwt.verify(token);

    let expert_idx = decoded.user_idx;    //전문가의 인덱스가 들어옴
    let user_idx = req.body.user_idx    //board안의 user_idx
    let board_idx = req.body.board_idx;
    let board_budget = req.body.board_budget;

    let board_status = 2;

    if (!user_idx || !board_idx) {
        res.status(400).send({
            message : "Null Value"
        });
    } else {
        let idxs = [user_idx, expert_idx];

        //잔고 바꾸기
        for (var i = 0; i < 2; i++) {
            let getBudgetQuery = 'SELECT user_budget FROM user WHERE user_idx = ?';
            let getBudget = await db.queryParam_Arr(getBudgetQuery, [idxs[i]]);

            let budget = getBudget[0].user_budget;

            if (i == 0) {
                budget -= board_budget;
                console.log("유저의 잔고 : " + budget);
            } else {
                budget += parseInt(board_budget);
                console.log("전문가의 잔고 : " + budget);
            }

            let changeBudgetQuery = 'UPDATE user SET user_budget = ? WHERE user_idx = ?';
            let changeBudgetResult = await db.queryParam_Arr(changeBudgetQuery, [budget, idxs[i]]);

            if (!changeBudgetResult) {
                res.status(500).send({
                    message : "Internal Server Error : update user_budget"
                });
            }           
        }

        //신청서 상태 바꾸기
        let acceptBoardQuery = 'UPDATE board SET board_status = ? WHERE board_idx = ?';
        let acceptBoardResult = await db.queryParam_Arr(acceptBoardQuery, [ board_status, board_idx]);

        if (!acceptBoardResult) {
            res.status(500).send({
                message : "Internal Server Error : update board error"
            });
        } else {
            res.status(200).send({
                message : "Successfully Update Borad Data",
                board_idx : board_idx
            });
        }
    }
});

router.delete('/', async (req, res) => {
    //게시글 상태 : 거절(3)
    //게시글 전문가 인덱스 없애기
    let token = req.headers.token;
	let decoded = jwt.verify(token);

    let user_idx = decoded.user_idx;
    let board_idx = req.body.board_idx;

    let board_status = 3;

    if (!user_idx || !board_idx) {
        res.status(400).send({
            message : "Null Value"
        });
    } else {
        let acceptBoardQuery = 'UPDATE board SET expert_idx = null, board_status = ? WHERE board_idx = ?';
        let acceptBoardResult = await db.queryParam_Arr(acceptBoardQuery, [board_status, board_idx]);

        if (!acceptBoardResult) {
            res.status(500).send({
                message : "Internal Server Error : delete board error"
            });
        } else {
            res.status(200).send({
                message : "Successfully Delete Borad Data",
                board_idx : board_idx
            });
        }
    }

});
module.exports = router;