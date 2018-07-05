const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

router.post('/', async (req, res) => {
    let trans_idx = req.body.trans_idx;
    let trans_name = req.body.trans_name;
    let trans_lastingtime = req.body.trans_lastingtime;
    let trans_content = req.body.trans_content;
    let trans_budget = req.body.trans_budget;
    let place_idx = req.body.place_idx;

    if (!trans_idx || !place_idx) {
        res.status(400).send({
            message : "Null Value"
        });
    } else {
        let addTransQuery = 'INSERT INTO transport (trans_idx, trans_name, trans_lastingtime, trans_content, trans_budget, place_idx )';
        let addTrans = await db.queryParam_Arr(addTransQuery, [trans_idx, trans_name, trans_lastingtime, trans_content, trans_budget, place_idx]);

        if (addTrans) {
            res.status(500).send({
                message : "Internal Server Error"
            });
        } else {
            res.status(201).send({
                message : "Successfully Add Transportation",
                data : addTrans
            });
        }
    }
});

router.delete('/', async(req, res) => {
    let trans_idx = req.body.trans_idx;

    let selectTransQuery = 'SELECT trans_idx FROM transportation WHERE trans_idx = ?';
    let selectTrans = await db.queryParam_Arr(selectTransQuery, [trans_idx]);

    if (!selectTrans) {
        res.status(500).send({
            message : "Internal Server Error"
        });
    } else if (selectTrans.length == 1) {
        let deleteTransQuery = 'DELETE FROM transportation WHERE trans_idx = ?';
        let deleteTrans = await db.queryParam_Arr(deleteTransQuery, [trans_idx]);

        if (!delteTrans) {
            res.stau
        }
    } else {
        res.status(201).send({
            message : "Review Deletion Success"
        });
    }
})
