const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');
const moment = require('moment');

//후기 수정 : PUT
router.put('/', async (req, res) => {
    let review_idx = req.body.review_idx;
    let review_content = req.body.review_content;
    let review_rating = req.body.review_rate;

    let review_writetime = moment().format('YYYY-MM-DD hh:mm:ss');

    if (!review_idx || !review_content || !review_rating) {
        console.log("review update data null");
        res.status(400).send( {
            message : "Null Value : Review Update"
        });
    } else {
        let updateQuery = 'UPDATE review SET (review_content, review_rating, review_writetime) = (?, ?, ?) WHERE review_idx = ?';
        let updateResult = await db.queryParam_Arr(updateQuery, [review_content, review_rating, review_writetime, review_idx]);

        if (!updateResult) {
            console.log("review update error");
            res.status(500).send({
                message : "Internal Server Error : Update Error"
            });
        } else {
            res.status(200).send({
                message : "Successfully Update Review",
                review_idx : review_idx
            });
        }
    }
});

//후기 보기 : GET
router.get('/:review_idx', async (req, res) => {
    let review_idx = req.params.review_idx;

    if (!review_idx) {
        console.log("review idx null");
        res.status(400).send( {
            message : "Null Value : Get Review"
        });
    } else {
        let selectReviewQuery = 'SELECT * FROM review WHERE review_idx = ?';
        let selectReviewResult = await db.queryParam_Arr(selectReviewQuery, [reiew_idx]);

        if (selectReviewResult) {
            res.status(500).send({
                message : "Internal Server Error : Select Review"
            });
        } else {
            res.status(200).send({
                message : "Successfully Get Review", 
                review : selectReviewResult
            });
        }
    }

});

module.exports = router;