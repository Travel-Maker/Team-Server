const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

//마이 페이지 정보 뿌리기
router.post('/', async (req, res) => {
    let token = req.headers.token;
	let decoded = jwt.verify(token);

    let user_idx = decoded.user_idx;
    
    if (!user_idx) {
        console.log("NULL");
        res.status(400).send( {
            message : "Null Value"
        });
    } else {
        let selectUserQuery = 'SELECT * FROM user WHERE user_idx =?';
        let selectUserResult = await db.queryParam_Arr(selectUserQuery, [user_idx]);

        if (!selectUserResult) {
            res.status(500).send({
                message : "Internal Server Error : select user data" 
            });
        } else {
            res.status(200).send({
                message : "Successfully Get User Data",
                userData : selectUserResult
            });
        }
    }
});

//전문가 신청
router.put('/', async (req, res) => {
    let token = req.headers.token;
	let decoded = jwt.verify(token);

    let user_idx = decoded.user_idx;

    let expert_city = req.body.expert_city;

    console.log("user_idx" + user_idx + " // expert_city input : " + expert_city);
    console.log(expert_city);


    if (!user_idx) {
        res.status(400).send({
            message : "Null Value : user_idx"
        });
    } else {
        for (var i = 0; i < expert_city.length; i++) {
            let insertExpertQuery = "UPDATE user SET expert_city" + (i + 1) +" = ? WHERE user_idx = ?";
            let insertExpert = await db.queryParam_Arr(insertExpertQuery, [ expert_city[i], user_idx]);

            if (!insertExpert) {
                res.status(500).send({
                    message : "Internal Server Error: insert expert data"
                });
            }
        }

        let changeToExpertQuery = 'UPDATE user SET user_expert = 1 expert_grade = 0 WHERE user_idx = ?';
        let changeToExpertResult = await db.queryParam_Arr(changeToExpertQuery, [user_idx]);
        
        if (!changeToExpertResult) {
            res.status(500).send({
                message : "Internal Server Error : update user to expert"
            });
        } else {
            res.status(201).send({
                message : "Successfully Update User Data"
            });
        }
    }
});

//코멘트 달린 전문가 선택
router.put('/select', async (req, res) => {
    let token = req.headers.token;
	let decoded = jwt.verify(token);

    let user_idx = decoded.user_idx;
    let expert_idx = req.body.expert_idx;
    let board_idx = req.body.board_idx;

    let expert_grade = 0;

    if (!expert_idx || !board_idx || !country_idx) {
        res.status(400).send({
            message : "Null Value"
        });
    } else {
        let updateBoardQuery = 'UPDATE board SET expert_idx = ? expert_grade = ? WHERE user_idx = ? AND board_idx = ?';
        let updateBoardResult = await db.queryParam_Arr(updateBoardQuery, [expert_idx, expert_grade, user_idx, board_idx]);

        if (!updateBoardResult) {
            res.status(500).send({
                message : "Invaild Server Error : set expert"
            });
        } else {
            res.status(200).send({
                message : "Successfully Update Expert"
            });
        }
    }
});

module.exports = router;
