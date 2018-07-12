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

    if (!selectPlanResult) {
        res.status(500).send({
            message : "Internal Server Error : select send plan error"
        });
    } else {
        res.status(200).send({
            message : "Successful Get Board Data",
            send_board : selectPlanResult
        });
    }
});

module.exports = router;