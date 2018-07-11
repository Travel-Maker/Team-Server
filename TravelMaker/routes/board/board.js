const express = require('express');
const router = express.Router();

const moment = require('moment');
const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

//국가상세에서 신청하기 더보기
router.get('/:country_idx', async (req, res) => {
    let country_idx = req.params.country_idx;

    if (!country_idx) {
        res.status(400).send({
            message : "Null Value : country_idx"
        });
    } else {
        let selectBoardQuery = 'SELECT b.board_idx, b.board_title, count(*) as comment_count FROM board as b LEFT JOIN comment as c ON b.board_idx = c.board_idx WHERE b.country_idx = ? GROUP BY b.board_title ORDER BY b.board_idx DESC'
        let selectBoardResult = await db.queryParam_Arr(selectBoardQuery, [country_idx]);

        let selectUserInfoQuery = 'SELECT * FROM user as u WHERE u.user_idx in (SELECT user_idx FROM board WHERE country_idx = ?)';
        let selectUserInfoResult = await db.queryParam_Arr(selectUserInfoQuery, [country_idx]);


        if (!selectBoardResult || !selectUserInfoResult) {
            res.status(500).send({
                message : "Internal Server Error : Select Board"
            });
        } else {
            res.status(200).send({
                message : "Successfully Get Board",
                boardData : selectBoardResult,
                user_in_board_data : selectUserInfoResult,
                country_idx : country_idx
            });
        }
    }
});

//신청하기 board 생성 하고, plan 넣기
router.post('/', async (req, res) => {
    //case 1 : country에서 신청하기 누름
    let token = req.headers.token;
    let decoded = jwt.verify(token);

    let user_idx = decoded.user_idx;
    let board_title = req.body.board_title;
    let board_city = req.body.board_city;
    let board_dep_time = req.body.board_dep_time;
    let board_arr_time = req.body.board_arr_time;
    let board_days = req.body.board_days;
    let board_content = req.body.board_content;

    let board_coin = req.body.board_coin;
    let board_status = 0;
    let board_writetime = moment().format('YYYY-MM-DD hh:mm:ss');

    let board_plan = req.body.board_plan;   //plan을 담은 배열
    let country_idx = req.body.country_idx; //나라 상세보기에서 했을 시
    let expert_idx = req.body.expert_idx   //전문가 페이지에서 작성했을시
    let board_idx = null;

    if (!user_idx || !board_title || !board_city || !board_dep_time || !board_arr_time || !board_plan || !country_idx) {
        res.status(400).send({
            message : "Null Value"
        });
    } else {
        if (expert_idx != null) {   //전문가페이지에서 작성했을 때 전문가로 들어올 때는 무조건 country_idx를 가지고 있기 때문에 괜찮음
            let selectExpertQuery = 'SELECT expert_grade FROM user WHERE user_idx = ?';
            let selectExpertResult = await db.queryParam_Arr(selectExpertQuery, [expert_idx]);

            console.log(selectExpertResult);

            let expert_grade = selectExpertResult[0].expert_grade;  //전문가 등급
            board_coin = calcBoardCoin(expert_grade, board_days);  //전문가 등급에 따른 코인 계산
            //
        }
        
        //국가 페이지에서 작성했을 때
        let createBoardQuery = 'INSERT INTO board (country_idx, user_idx, expert_idx, board_title, board_city, board_dep_time, board_arr_time, board_content, board_status, board_coin, board_writetime) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        let createBoardResult =  await db.queryParam_Arr(createBoardQuery, [country_idx, user_idx, expert_idx, board_title, board_city, board_dep_time, board_arr_time, board_content, board_status, board_coin, board_writetime]);
    
        if (!createBoardResult) {
            res.status(500).send({
                message : "Internal Server Error : insert board error"
            });
        } else {
            board_idx = createBoardResult.insertId;

            console.log("board_idx : " + board_idx);

            let plan_in = board_plan[0].in;
            let acommondations = board_plan[0].acc;
            let plan_out = board_plan[0].out;

            for (var i = 0; i < plan_in.length; i++) {
                let plan_count = i + 1;
                let insertPlanQuery = 'INSERT INTO plan VALUES (null, ?, ?, ?, ?, ?, ?)';
                let insertPlanResult = await db.queryParam_Arr(insertPlanQuery, [country_idx, plan_count, plan_in[i], acommondations[i], plan_out[i], board_idx]);

                if (!insertPlanResult) {
                    res.status(500).send({
                        message : "Invalild Server Error : insert plan"
                    });
                }
            }
        }
        res.status(200).send({
            message : "Successfully Create Board Data",
            board_idx : board_idx
        });
    
    }
});

//신청서 수정 : 완성같은 미완성
router.put('/', async (req, res) => {
    let token = req.headers.token;
    let decoded = jwt.verify(token);

    let user_idx = decoded.user_idx;
    let board_idx = req.body.board_idx;
    let board_title = req.body.board_title;
    let board_city = req.body.board_city;
    let board_dep_time = req.body.board_dep_time;
    let board_arr_time = req.body.board_arr_time;
    let board_days = req.body.board_days;
    let board_content = req.body.board_content;

    let board_coin = req.body.board_coin;
    let board_status = 0;
    let board_writetime = moment().format('YYYY-MM-DD hh:mm:ss');

    let board_plan = req.body.board_plan;   //plan을 담은 배열
    let country_idx = req.body.country_idx; //나라 상세보기에서 했을 시
    let expert_idx = req.body.expert_idx   //전문가 페이지에서 작성했을시

    if (!user_idx || !board_title || !board_city || !board_dep_time || !board_arr_time || !board_content || !board_plan || !country_idx) {
        res.status(400).send({
            message : "Null Value"
        });
    } else {
        let updateBoardQuery = 'UPDATE board SET country_idx = ?, user_idx = ?, expert_idx = ?, board_title = ?, board_city = ?, board_dep_time = ?, board_arr_time = ?, board_content = ?, board_status = ?, board_coin = ?, board_writetime = ? WHERE board_idx = ?';
        let updateBoardResult = await db.queryParam_Arr(updateBoardQuery, [country_idx, user_idx, expert_idx, board_title, board_city, board_dep_time, board_arr_time, board_content, board_status, board_coin, board_writetime, board_idx]);
        
        if (!updateBoardResult) {
            res.status(500).send({
                message : "Invaild Server Error : update board"
            });
        } else {
            let plan_in = board_plan[0].in;
            let acommondations = board_plan[0].acc;
            let plan_out = board_plan[0].out;

            for (var i = 0; i < plan_in.length; i++) {
                let plan_count = i + 1;
                let insertPlanQuery = 'UPDATE plan SET plan_in = ?, plan_acc_name = ?, plan_out = ? WHERE plan_count = ? AND board_idx = ?';
                let insertPlanResult = await db.queryParam_Arr(insertPlanQuery, [plan_in[i], acommondations[i], plan_out[i], plan_count, board_idx]);

                if (!insertPlanResult) {
                    res.status(500).send({
                        message : "Invalild Server Error : update plan"
                    });
                }
            }

            res.status(200).send({
                message : "Successfully Update Board Data",
                board_idx : board_idx
            });

        }
        
    
    }


});

//신청서 삭제
router.delete('/', async (req, res) => {
    let board_idx = req.body.board_idx;

    let selectExpertQuery = 'SELECT expert_idx FROM board FROM board_idx = ?';
    let selectExpertResult = await db.queryParam_Arr(selectExpertQuery, [board_idx]);

    let board_expert = selectExpertQuery[0].expert_idx;

    //전문가가 이미 할당된 신청서는 삭제할 수 없음
    if (board_expert) {
        res.status(500).send({
            message : "Already accepted by experts"
        });
    }

    let deletePlanQuery = 'DELETE FROM plan WHERE board_idx = ?';
    let deletePlanResult = await db.queryParam_Arr(deletePlanQuery, [board_idx]);

    let deleteBoardQuery = 'DELETE FROM board WHERE board_idx = ?';
    let deleteBoardResult = await db.queryParam_Arr(deleteBoardQuery, [board_idx]);

    if (!deletePlanResult) {
        res.status(500).send({
            message : "Invaild Server Error : delete plan error"
        });
    } else if (!deleteBoardResult) {
        res.status(500).send({
            message : "Invaild Server Error : delete board error"
        });
    } else {
        res.status(200).send({
            message : "Successfully Delete Board And Plan"
        });
    }
});

//전문가 등급에 따른 coin 계산 함수
function calcBoardCoin (grade, days) {
    for (var i = 0; i < 3; i++) {
        if (grade == i) {
            return (grade + 1) * 100 * days;
        }
    }
}

module.exports = router;