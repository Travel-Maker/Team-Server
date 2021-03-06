const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const s3 = new aws.S3();
aws.config.loadFromPath('./config/aws_config.json');
const upload = require('../../config/multer.js');

//계획서 작성 : 완료
router.post('/', upload.array('place_img'), async (req, res, next) => {
    let token = req.headers.token;
    let decoded = jwt.verify(token);

    let expert_idx = decoded.user_idx; //전문가 인덱스
    let board_idx = parseInt(req.body.board_idx);
    let plan = JSON.parse(req.body.plan); //여행 계획

    var msg = "Successfully Insert Board and Place and Trans Data";

    // console.log(req.body);
    // console.log("-------------body 안의 plan");
    let totalBudget = 0;
    let img_location = 0;


    console.log(plan);

    if (!board_idx || !plan) {
        msg = "Null Value : idx or plan data";
        next({
            message: msg
        });
    } else {
        // console.log("here");
        let selectUserBudgetQuery = 'SELECT user_budget FROM user WHERE user_idx = (SELECT user_idx FROM board WHERE board_idx = ?)';
        let selectUserBudget = await db.queryParam_Arr(selectUserBudgetQuery, [board_idx]);

        let selectExpertBudgetQuery = 'SELECT user_budget FROM user WHERE user_idx = ?';
        let selectExpertBudget = await db.queryParam_Arr(selectExpertBudgetQuery, [expert_idx]);

        let selectCoinQuery = 'SELECT board_coin FROM board WHERE board_idx = ?';
        let selectCoin = await db.queryParam_Arr(selectCoinQuery, [board_idx]);

        if (!selectUserBudget || !selectExpertBudget || !selectCoin) {
            msg = "Internal Server Error : select budget";
            next({
                message: msg
            });
        } else if ((selectUserBudget.length == 0) || (selectExpertBudget.length == 0) || (selectCoin.length == 0)) {
            msg = "Internal Server Error : select budget";
            next({
                message: msg
            });
        } else {
            let user_budget = selectUserBudget[0].user_budget; //신청자 보유 코인

            let expert_budget = selectExpertBudget[0].user_budget; //전문가 보유 코인



            let board_coin = selectCoin[0].board_coin; //신청서에 할당된 코인

            let new_budget = [user_budget - board_coin, expert_budget - board_coin];

            if (new_budget[0] < 0) {
                msg = "Low cost for users";
                next({
                    message: msg
                });
            } else {
                // console.log("here2");
                //정삭적인 coin 보유량 일 때
                let updateUserBudgetQuery = 'UPDATE user SET user_budget = ? WHERE user_idx = (SELECT user_idx FROM board WHERE board_idx = ?)';
                let updateUserBudget = await db.queryParam_Arr(updateUserBudgetQuery, [new_budget[0], board_idx]);

                let updateExpertBudgetQuery = 'UPDATE user SET user_budget = ? WHERE user_idx = ?';
                let updateExpertBudge = await db.queryParam_Arr(updateExpertBudgetQuery, [new_budget[1], expert_idx]);

                if (!updateUserBudget || !updateExpertBudge) {
                    msg = "Invaild Server Error : Update user and expert budget";
                    next({
                        message: msg
                    });
                } else {

                    for (var i = 0; i < plan.length; i++) {
                        let place = plan[i].place; //n day에 갈 장소들
                        let trans = plan[i].trans; //n day에 이용할 교통수단

                        // console.log("\n-------------day" + i + " place list");
                        //console.log(place);
                        // console.log("\n-------------day" + i + " trans list");
                        //console.log(trans);

                        let place_day = i + 1;

                        //전체 place 관광지 입력
                        for (var j = 0; j < place.length; j++) {
                            let place_count = j + 1;

                            //console.log(i + "---" + j);

                            if (!place[j].place_latitude || !place[j].place_longitude) {
                                msg = "Null Value : longtitude and latitude";
                                next({
                                    message: msg
                                });
                                break;
                            } else {
                                //console.log(place_day + "--" + place_count + "--" + place[j].place_name + "--" + place[j].place_comment + "--" + place[j].place_latitude + "--" + place[j].place_longitude + "--" + place[j].place_budget + "--" + place[j].place_budget_comment + "--" + board_idx)
                                let insertPlaceQuery = 'INSERT INTO place (place_day, place_count, place_name, place_comment, place_latitude, place_longitude, place_budget, place_budget_comment, board_idx) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                                var insertPlaceResult = await db.queryParam_Arr(insertPlaceQuery, [place_day, place_count, place[j].place_name, place[j].place_comment, place[j].place_latitude, place[j].place_longitude, place[j].place_budget, place[j].place_budget_comment, board_idx]);

                                if (place[j].place_budget) {
                                    totalBudget += parseInt(place[j].place_budget);
                                }

                                if (!insertPlaceResult) {
                                    //console.log("error : " + i + "---" + j);
                                    break;
                                }
                            }
                        }

                        if (insertPlaceResult == undefined) {
                            msg = "Internal Server Error : insert place";
                            next({
                                message: msg
                            });
                            break;
                        } else {
                            //해당 장소에 이미지 넣기 
                            if (req.files.length !== 0) {
                                for (var j = 0; j < place.length; j++) {
                                    let place_count = j + 1;
                                    if (place[j].image === 1) {
                                        let updateImageQuery = 'UPDATE place SET place_img = ? WHERE board_idx = ? AND place_day = ? AND place_count = ?';
                                        var updateImageResult = await db.queryParam_Arr(updateImageQuery, [req.files[img_location].location, board_idx, place_day, place_count]);

                                        if (!updateImageResult) {
                                            break;
                                        }
                                        img_location++;
                                    }
                                }

                                if (updateImageResult === undefined) {
                                    msg = "Invaild Server Error : upload image";
                                    next({
                                        message: msg
                                    });
                                    break;
                                } else {
                                    //전체 trans 입력
                                    for (var j = 0; j < trans.length; j++) {
                                        let insertTransQuery = 'INSERT INTO transportation VALUES (null, ?, ?, ?, ?, ?, ?, ?)';
                                        var insertTransResult = await db.queryParam_Arr(insertTransQuery, [trans[j].trans_name, trans[j].trans_budget, place_day, trans[j].trans_dep_time, trans[j].trans_arr_time, trans[j].trans_content, board_idx]);

                                        if (trans[j].trans_budget) {
                                            totalBudget += parseInt(trans[j].trans_budget);
                                        }

                                        if (!insertTransResult) {
                                            break;
                                        }
                                    }

                                    if (insertTransResult == undefined) {
                                        // res.status(500).send({
                                        //     messgae : "Internal Server Error : insert transpostation"
                                        // });
                                        msg = "Internal Server Error : insert transpostation";
                                        next({
                                            message: msg
                                        });
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    next({
        message: msg,
        board_idx: board_idx
    });

}, async (err, req, res, next) => {
    let board_status = 4; //작성 완료 status

    console.log(err.message);
    if (err.message === "Successfully Insert Board and Place and Trans Data") {
        console.log('1');
        let updateStatusQuery = 'UPDATE board SET board_status = ? WHERE board_idx = ?';
        let updateStatusResult = await db.queryParam_Arr(updateStatusQuery, [board_status, err.board_idx]);

        res.status(200).send({
            message: err.message
        });
    } else if (err.message === "Null Value : longtitude and latitude") {
        console.log('2');
        res.status(400).send({
            message: err.message
        });
    } else if (err.message === "Low cost for users") {
        console.log('3');
        res.status(400).send({
            message: err.message
        });
    } else if (err.message === "Null Value : idx or plan data") {
        console.log('4');
        res.status(400).send({
            message: err.message
        });
    } else {
        console.log('5');
        res.status(500).send({
            message: err.message
        });
    }
});



//계획서 수정
router.put('/', async (req, res) => {
    let token = req.headers.token;
    let decoded = jwt.verify(token);

    let user_idx = decoded.user_idx;
    let board_idx = parseInt(req.body.board_idx);
    let plan = JSON.parse(req.body.plan);

    let totalBudget = 0;

    if(!board_idx || !plan) {
        res.status(400).send({
            message : "Null Value : index of plan"
        });

    } else {
        for (var i = 0; i < plan.length; i++) {
            let place = plan[i].place;     //n day에 갈 장소들
            let trans = plan[i].trans;     //n day에 이용할 교통수단

            let place_day = i + 1;

            let cntPastPlaceQuery = 'SELECT COUNT(*) as pp FROM place WHERE board_idx = ? AND place_day = ?';
            let cntPastPlaceResult = await db.queryParam_Arr(cntPastPlaceQuery, [board_idx, place_day]);

            let past_place_cnt = parseInt(cntPastPlaceResult[0].pp);

            //전체 place 관광지 수정
            var j = 0;
            for (j = 0; j < place.length; j++) {
                let place_count = j + 1;

                if (!place[j].place_latitude || !place[j].place_longitude) {
                    res.status(500).send({
                        message : "Null Value : longtitude and latitude"
                    });
                } else {
                    if (j < past_place_cnt) {  //기존의 장소 수정
                        let updatePlaceQuery = 'UPDATE place SET place_name = ?, place_comment = ?, place_latitude = ?, place_longitude = ?, place_budget = ?, place_budget_comment = ?, place_img = ? WHERE board_idx =? AND place_day = ? AND place_count = ?';
                        let updatePlaceResult = await db.queryParam_Arr(updatePlaceQuery, [place[j].place_name, place[j].place_comment, place[j].place_latitude, place[j].place_longitude, place[j].place_budget, place[j].place_budget_comment, null, board_idx, place_day, place_count]);

                        if (place[j].place_budget) {
                            totalBudget += parseInt(place[j].place_budget);
                        }

                        if (!updatePlaceResult) {
                            res.status(500).send({
                                messgae : "Internal Server Error : update place"
                            });
                        } 
                    } else {    //수정 시 새로운 장소 추가
                        let insertPlaceQuery = 'INSERT INTO place VALUES (null, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                        let insertPlaceResult = await db.queryParam_Arr(insertPlaceQuery, [place_day, place_count, place[j].place_name, place[j].place_comment, place[j].place_latitude, place[j].place_longitude, place[j].place_budget, null, board_idx]);
                    
                        if (place[j].place_budget) {
                            totalBudget += parseInt(place[j].place_budget);
                        }

                        if (!insertPlaceResult) {
                            res.status(500).send({
                                messgae : "Internal Server Error : insert place"
                            });
                        } 
                    }
                }
                
                //수정 시 장소가 줄어들었을 때
                if (j <= past_place_cnt) {
                    for (; j <= past_place_cnt; j++) {
                        let deletePlaceQuery = 'DELETE FROM palce WHERE board_idx = ? AND place_day = ? AND place_count = ?';
                        let deletePlaceResult = await db.queryParam_Arr(deletePlaceQuery, [board_idx, place_count, j]);

                        if (!deletePlaceResult) {
                            res.status(500).send({
                                message : "Invaild Server Error"
                            });
                        }
                    }
                }
            }

            let cntPastTransQuery = 'SELECT COUNT(*) as pt FROM transportation WHERE board_idx = ? AND trans_day = ?';
            let cntPastTransResult = await db.queryParam_Arr(cntPastTransQuery, [board_idx, place_day]);

            let past_trans_cnt = parseInt(cntPastTransResult[0].pt);

            //전체 trans 입력
            for (j = 0; j < trans.length; j++) {
                if (!trans[j].trans_dep_time || !trans[j].trans_arr_time) {
                    res.status(500).send({
                        message : "Null Value : longtitude and latitude"
                    });
                } else {
                    if (j < past_trans_cnt) {
                        let updateTransQuery = 'UPDATE transportation SET trans_name = ?, trans_budget = ?, trans_dep_time = ?, trans_arr_time = ?, trans_content = ? WHERE board_idx = ? AND trans_day = ?';
                        let updateTransResult = await db.queryParam_Arr(updateTransQuery, [trans[j].trans_name, trans[j].trans_budget, trans[j].trans_dep_time, trans[j].trans_arr_time, trans[j].trans_content, board_idx, place_day]);
                    
                        if (trans[j].trans_budget) {
                            totalBudget += parseInt(trans[j].trans_budget);
                        }

                        if (!updateTransResult) {
                            res.status(500).send({
                                messgae : "Internal Server Error : update transpostation"
                            });
                        } 
                    } else {
                        let insertTransQuery = 'INSERT INTO transportation VALUES (null, ?, ?, ?, ?, ?, ?, ?)';
                        let insertTransResult = await db.queryParam_Arr(insertTransQuery, [trans[j].trans_name, trans[j].trans_budget, place_day, trans[j].trans_dep_time, trans[j].trans_arr_time, trans[j].trans_content, board_idx]);
                    
                        if (trans[j].trans_budget) {
                            totalBudget += parseInt(trans[j].trans_budget);
                        }

                        if (!insertTransResult) {
                            res.status(500).send({
                                messgae : "Internal Server Error : insert transpostation"
                            });
                        }
                    }
                }

                if (j <= past_trans_cnt) {
                    for (; j <= past_trans_cnt; j++) {
                        let deletePlaceQuery = 'DELETE FROM transportation WHERE board_idx = ? AND place_day = ? AND place_count = ?';
                        let deletePlaceResult = await db.queryParam_Arr(deletePlaceQuery, [board_idx, place_count, j]);

                        if (!deletePlaceResult) {
                            res.status(500).send({
                                message : "Invaild Server Error"
                            });
                        }
                    }
                }
            }
        }  
        let setBoardBudgetQuery = 'UPDATE board SET board_budget = ? WHERE board_idx = ?';
        let setBoardBudgetResult = await db.queryParam_Arr(setBoardBudgetQuery, [totalBudget, board_idx]);

        if (!setBoardBudgetResult) {
            res.status(500).send({
                message : "Internal Server Error : update board budget"
            });

        } else {
            res.status(200).send({
                message : "Successfully Update Board and Place and Trans Data"
            });
        }
    }

});

router.delete('/', async (req, res) => {
    let board_idx = req.body.board_idx;

    if (!board_idx) {
        res.status(400).send({
            message : "Null Value : board idx"
        });
    } else {
        let deletePlaceQuery = 'DELETE FROM place WHERE board_idx = ?';
        let deletePlaceResult = await db.queryParam_Arr(deletePlaceQuery, [board_idx]);

        let deleteTransQuery = 'DELETE FROM transportation WHERE board_idx = ?';
        let deleteTransResult = await db.queryParam_Arr(deleteTransQuery, [board_idx]);

        if (!deletePlaceResult || !deleteTransResult) {
            res.status(500).send({
                message : "Invaild Server Error : delete place and transportation"
            });
        } else {
            res.status(200).send({
                message : "Successfully Delete Place and Transportatoin"
            });
        }
    }
    
});

module.exports = router;
