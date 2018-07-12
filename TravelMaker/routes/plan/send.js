const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

//보낸 플랜 관리
router.post('/', async (req, res) => {
    let token = req.headers.token;
    let decoded = jwt.verify(token);

    let user_idx = decoded.user_idx;

    let selectPlanQuery = 'SELECT board_idx, board_title, board_status, expert_idx FROM board WHERE user_idx = ? ORDER BY board_idx DESC';
    let selectPlanResult = await db.queryParam_Arr(selectPlanQuery, [user_idx]);
    //console.log(selectPlanResult);

    console.log(selectPlanResult.length);

    let sendBoards = new Array();

    if (!selectPlanResult) {
        res.status(500).send({
            message : "Internal Server Error : select send plan error"
        });
    } else {
        for (var i = 0; i < selectPlanResult.length; i++) {
            let user_nick = selectPlanResult[i].expert_idx;
            console.log("-----" + user_nick);

            if (user_nick != null) {
                let selectUserNickQuery = 'SELECT user_nick FROM user WHERE user_idx = ?';
                let selectUserNickResult = await db.queryParam_Arr(selectUserNickQuery, [selectPlanResult[i].expert_idx]);
                console.log(selectUserNickResult);

                if (!selectUserNickResult) {
                    res.status(500).send({
                        message : "Invaild Server Error : select nickname error"
                    });
                    break;
                } 
                
                user_nick = selectUserNickResult[0].user_nick;
            } else {
                user_nick = null;
            }

            let board = {
                "user_nick" : user_nick,
                "board_data" : selectPlanResult[i]
            }

            sendBoards[i] = board;  
            
        }
        res.status(200).send({
            message : "Successful Get Board Data",
            receive_board : sendBoards
        });
    }
});

module.exports = router;