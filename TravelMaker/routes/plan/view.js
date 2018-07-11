const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

router.get('/:board_idx', async(req, res) => {
    let token = req.headers.token;
	let decoded = jwt.verify(token);

    let user_idx = decoded.user_idx;
    let board_idx = req.params.board_idx;

    //플랜과 교통을 가져옴
    let selectBoradQuery = 'SELECT * FROM board WHERE board_idx = ?';
    let selectBoradResult = await db.queryParam_Arr(selectBoradQuery, [board_idx]);

    let board_days = selectBoradResult[0].board_days;

    let total_plan = new Array();

    for (var i = 0; i < board_days; i++) {
        let place_day = i + 1;

        let selectPlaceQuery = 'SELECT * FROM place WHERE board_idx = ? AND place_day = ? ORDER BY place_idx ASC';
        let selectPlaceResult = await db.queryParam_Arr(selectPlaceQuery, [board_idx, place_day]);

        //console.log(selectPlaceResult);
        //console.log("--------------");

        let selectTrsnaQuery = 'SELECT * FROM transportation WHERE board_idx = ? AND trans_day = ? ORDER BY trans_idx ASC';
        let selectTrsnaResult = await db.queryParam_Arr(selectTrsnaQuery, [board_idx, place_day]);
        //console.log(selectTrsnaResult);

        if (!selectPlaceResult || !selectTrsnaResult) {
            res.status(500).send({
                message : "Invaild Server Error : select place and transpostation"
            });
        }

        let nday_plan = {
            "place" : selectPlaceResult,
            "trans" : selectTrsnaResult
        }

        total_plan[i] = nday_plan;
    }

    res.status(200).send({
        message : "Successfully Get Total Board Data",
        total_plan : total_plan,
        board_idx : board_idx
    });
});


module.exports = router;


