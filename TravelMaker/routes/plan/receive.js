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
    
    let selectPlanQuery = 'SELECT * FROM board WHERE expert_idx = ? ORDER BY board_idx DESC';
    let selectPlanReault = await db.queryParam_Arr(selectPlanQuery, [user_idx]);

    if (!selectPlanReault) {
        res.status(500).send({
            'message' : "Internal Server Error : select error"
        });
    } else {
        res.status(200).send({
            message : "Successful Get Board Data",
            receive_board : selectPlanReault
        });
        
    }
});

//받은 플랜 상세보기
router.get('/:board_idx', async (req, res) => {
    //해당 일정에 대한 플랜과 교통 + 시티
    //게시글 상태 확인완료(1)로 바꾸기
    let board_idx = req.params.board_idx;
    let board_status = 0

    let selcetPlacesQuery = 'SELECT * FROM plan WHERE board_idx = ?';
    let selcetPlacesResult = await db.queryParam_Arr(selcetPlacesQuery, [board_idx]);

    let updateBoardStatusQuery = 'UPDATE SET board_check = ? WHERE board_idx = ?';
    let updateBoardStatusResult = await db.queryParam_Arr(updateBoardStatusQuery,[ board_status, board_idx]);

    console.log("selcetPlacesResult : " + selcetPlacesResult);

    if (!selcetPlacesResult) {
        console.log("place select error");
        res.status(500).send({
            message : "Internal Server Error : select places"
        });
    } else {
        let selectCityQuery = 'SELECT * FROM city WHERE city_idx = ?';
        let selectCityResult = await db.queryParam_Arr(selectCityQuery, [selectCityQuery]); //특정 board에 해당하는 city이름 가져옴

        let selcetTransQuery = 'SELECT * FROM transportation WHERE place_idx = ?';  //특정 board에 해당하는 일정들 모두 불러오기
        let selcetTransResult;

        for (var i = 0; i < selectPlanReault.length; i++) {
            let selectResult = await db.queryParam_Arr(selcetTransQuery, [selcetPlacesResult[i].place_idx]);    //모든 일정에 대한 교통수단 불러오기
            
            if (!selectResult) {
                console.log("transportation select error");
                res.status(500).send({
                    message : "Internal Server Error : select transportation"
               });
            } else {
                selcetTransResult.push(selectResult);
            }
        }

        res.status(200).send({
            message : "Successfully Get Comment Places",
            totalPlaces : selcetPlacesResult, 
            totalTransportation : selcetTransResult
        });
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
        res.status(500).send({
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
    //게시글 ㅋ전문가 인덱스 없애기
    let token = req.headers.token;
	let decoded = jwt.verify(token);

    let user_idx = decoded.user_idx;
    let board_idx = req.body.board_idx;

    let board_status = 3;

    if (!user_idx || !board_idx) {
        res.status(500).send({
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