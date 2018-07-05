const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

router.post('/', async (req, res) => {
    let board_idx = req.body.board_idx;
    let country_idx = req.body.country_idx;
    let plan_count = req.body.plan_count;
    let plan_dep_time = req.body.plan_dep_time;
    let plan_arr_time = req.body.plan_arr_time;

    if (!board_idx || !country_idx || plan_count || !plan_arr_time || !plan_dep_time) {
        console.log("plan data null");
        res.status(500).send({
            message : "Null Value : Plan Data"
        });
    } else {
        let insertPlanQuery = 'INSERT INTO plan VALUES (?, ?, ?, ?, ?)';
        let insertPlanResult = await db.queryParam_Arr(insertPlanQuery, [])
    }
});

module.exports = router;
