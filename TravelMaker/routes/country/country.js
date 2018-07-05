const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

router.get('/:country_idx', function(req, res) {
    let country_idx = req.params.country_idx;
    let expert_idx = req.params.user_idx;
    let board_idx = req.params.boaard_idx;

    if (!country_idx) {
        console.log("NULL");
        res.status(400).send({
            message: "Null Value"
        })
    } else {
        let selectCountryQuery = 'SELECT * FROM country WHERE country_idx = ?';
        let selectCountry = await db.queryParam_Arr(selectCountryQuery, [country_idx]);

        if (!selectCountry) {
            res.status(500).send({
                message : "Internal Server Error"
            });
        } else if (selectCountry.length == 1) {
            console.log("Select Country Success");
            
            let selectExpertQuery = 'SELECT * FROM user WHERE user_expert = TRUE AND user_idx = ?';
            let selectExpert = await db.queryParam_Arr(selectExpertQuery, [expert_idx]);

            let selectBoardQuery = 'SELECT * FROM board WHERE board_idx = ?';
            let selectBoard = await db.queryParam_Arr(selectBoardQuery, [board_idx]);

            if (!selectExpert || !selectBoard) {
                res.status(500).send({
                    message : "Internal Server Error"
                });
            } else if (selectExpert.length == 1 && selectBoard.length == 1) {
                console.log("Select Expert Success");
                res.status
            } else {
                console.log("Select Expert Error or Select Board Error");
            }
            
        } else {
            console.log("Select Country Error");
        }
    }
});

module.exports = router;