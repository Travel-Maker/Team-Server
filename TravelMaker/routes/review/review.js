const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');
const moment = require('moment');

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
        let selectReviewResult = await db.queryParam_Arr(selectReviewQuery, [review_idx]);

        if (!selectReviewResult) {
            res.status(500).send({
                message : "Internal Server Error : Select Review"
            });
        } else {
            res.status(200).send({
                message : "Successfully Get Review Data", 
                review : selectReviewResult
            });
        }
    }

});

//후기 추가
router.post('/', async (req, res) => {
    let token = req.headers.token;
	let decoded = jwt.verify(token);

    let user_idx = decoded.user_idx;

    //let user_idx = req.body.user_idx;
    let expert_idx = req.body.expert_idx;
    let board_idx = req.body.board_idx;
    let review_content = req.body.review_content;
    let review_rating = parseFloat(req.body.review_rating);
    
    if (!user_idx || !board_idx) {
        res.status(400).send({
            message : "Null Value"
        });
    } else {
        let addReviewQuery = 'INSERT into review (user_idx, expert_idx, board_idx, review_content, review_rating ) VALUES ( ?, ?, ?, ?, ?)';
        let addReview = await db.queryParam_Arr(addReviewQuery, [user_idx, expert_idx, board_idx, review_content, review_rating]);

        if (!addReview) {
            res.status(500).send({
                message : "Internal Server Error : insert review"
            });
        } else {
            console.log("------평점 바꾸기");
            let selectExpertQuery = 'SELECT * FROM user WHERE user_idx = ?';
            let selectExpertResult = await db.queryParam_Arr(selectExpertQuery, [expert_idx]);

            let expert_rate = selectExpertResult[0].expert_rate; //해당 전문가의 기존 평점           

            if (!selectExpertResult) {
                res.status(500).send({
                    message : "Internal Server Error :select rate error"
                });
            } else {
                let countReviewQuery = 'SELECT COUNT(*) as review_count FROM review where expert_idx = ?';
                let countReview = await db.queryParam_Arr(countReviewQuery, [expert_idx]);

                let review_count = countReview[0].review_count; //해당 전문과 관련 리뷰 개수

                let new_rate = ((expert_rate * (review_count - 1)) + review_rating) / review_count;

                //console.log("전문가 기본 평점 : " + expert_rate + "\n새로 입력된 평점 : " + review_rating + "\n전문가의 리뷰 총 개수 : " + review_count);
                let updateRateQuery = 'UPDATE user SET expert_rate = ? WHERE user_idx = ?';
                let updateRateResult = await db.queryParam_Arr(updateRateQuery, [new_rate, expert_idx]);

                if (!updateRateResult) {
                    res.status(500).send({
                        message : "Internal Server Error : review add"
                    });

                } else {
                    res.status(201).send({
                        message : "Successfully Add Review",
                        review_idx : addReview.insertId
                    });
                }              
            }
        }
    }
});

//후기 수정 : PUT
router.put('/', async (req, res) => {
    let review_idx = req.body.review_idx;
    let review_content = req.body.review_content;
    let review_rating = req.body.review_rating;

    let review_writetime = moment().format('YYYY-MM-DD hh:mm:ss');

    if (!review_idx || !review_content || !review_rating) {
        console.log("review update data null");
        res.status(400).send( {
            message : "Null Value : Review Update"
        });
    } else {
        let selectPastQuery = 'SELECT * FROM review WHERE review_idx = ?';
        let selectPastResult = await db.queryParam_Arr(selectPastQuery, review_idx);

        let expert_idx = selectPastResult[0].expert_idx;       //해당 리뷰의 전문가 인덱스
        let past_review_rating = parseFloat(selectPastResult[0].review_rating); //수정하기 이전의 평점

        //console.log("전문가 인덱스 : " + expert_idx + "\n수정하기 이전의 평점 : " + past_review_rating);

        let updateQuery = 'UPDATE review SET review_content = ?, review_rating = ?, review_writetime = ? WHERE review_idx = ?';
        let updateResult = await db.queryParam_Arr(updateQuery, [review_content, review_rating, review_writetime, review_idx]);

        if (!updateResult) {
            console.log("review update error");
            res.status(500).send({
                message : "Internal Server Error : Update Error"
            });
        } else {
            let selectExpertQuery = 'SELECT * FROM user WHERE user_idx = ?';
            let selectExpertResult = await db.queryParam_Arr(selectExpertQuery, [expert_idx]);

            let expert_rate = selectExpertResult[0].expert_rate; //해당 전문가의 기존 평점  
            
            if (!selectExpertResult) {
                res.status(500).send({
                    message : "Internal Server Error :select rate error"
                });
            } else {
                let countReviewQuery = 'SELECT COUNT(*) as review_count FROM review where expert_idx = ?';
                let countReview = await db.queryParam_Arr(countReviewQuery, [expert_idx]);

                let review_count = countReview[0].review_count; //해당 전문과 관련 리뷰 개수

                let new_rate = ((expert_rate * (review_count - 1)) - review_rating + past_review_rating) / review_count;

                //console.log("전문가 기본 평점 : " + expert_rate + "\n새로 입력된 평점 : " + review_rating + "\n전문가의 리뷰 총 개수 : " + review_count);
                //console.log("새로 바뀐 평점 : " + new_rate);
                let updateRateQuery = 'UPDATE user SET expert_rate = ? WHERE user_idx = ?';
                let updateRateResult = await db.queryParam_Arr(updateRateQuery, [new_rate, expert_idx]);

                if (!updateRateResult) {
                    res.status(500).send({
                        message : "Internal Server Error : review update"
                    });

                } else {
                    res.status(201).send({
                        message : "Successfully Update Review Data"
                    });
                }              
            }
        }
    }
});

//후기 삭제
router.delete('/', async(req, res) => {
    let review_idx = req.body.review_idx;

    let selectReviewQuery = 'SELECT * FROM review WHERE review_idx = ?';
    let selectReview = await db.queryParam_Arr(selectReviewQuery, [review_idx]);
    
    let expert_idx = selectReview[0].expert_idx;
    let review_rating = selectReview[0].review_rating;

    if (!selectReview) {
        res.status(500).send({
            message : "Internal Server Error"
        });
    } else if (selectReview.length == 1) {
        let deleteReviewQuery = 'DELETE FROM review WHERE review_idx = ?';
        let deleteReview = await db.queryParam_Arr(deleteReviewQuery, [review_idx]);

        if (!deleteReview) {
            res.status(500).send({
                message : "Internal Server Error : delete review"
            });
        } else {
            let selectExpertQuery = 'SELECT * FROM user WHERE user_idx = ?';
            let selectExpertResult = await db.queryParam_Arr(selectExpertQuery, [expert_idx]);

            let expert_rate = selectExpertResult[0].expert_rate; //해당 전문가의 기존 평점  
            
            if (!selectExpertResult) {
                res.status(500).send({
                    message : "Internal Server Error :select rate error"
                });
            } else {
                let countReviewQuery = 'SELECT COUNT(*) as review_count FROM review where expert_idx = ?';
                let countReview = await db.queryParam_Arr(countReviewQuery, [expert_idx]);

                let review_count = countReview[0].review_count; //해당 전문과 관련 리뷰 개수

                let new_rate = ((expert_rate * (review_count + 1)) - review_rating) / review_count;

                //console.log("전문가 기본 평점 : " + expert_rate + "\n새로 입력된 평점 : " + review_rating + "\n전문가의 리뷰 총 개수 : " + review_count);
                //console.log("새로 바뀐 평점 : " + new_rate);
                let updateRateQuery = 'UPDATE user SET expert_rate = ? WHERE user_idx = ?';
                let updateRateResult = await db.queryParam_Arr(updateRateQuery, [new_rate, expert_idx]);

                if (!updateRateResult) {
                    res.status(500).send({
                        message : "Internal Server Error : review delete"
                    });

                } else {
                    res.status(201).send({
                        message : "Successfully Delete Review Data"
                    });
                }              
            }
        }
    }
});


module.exports = router;