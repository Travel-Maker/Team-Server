const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');


//계획서 작성
router.post('/', async (req, res) => {
    let token = req.headers.token;
    let decoded = jwt.verify(token);

    let user_idx = decoded.user_idx;
    let board_idx = req.body.board_idx;
    let plan = req.body.plan;

    // console.log(req.body);
    // console.log("-------------body 안의 plan");
    // console.log(plan);

    let totalBudget = 0;

    for (var i = 0; i < plan.length; i++) {
        let place = plan[i].place;     //n day에 갈 장소들
        let trans = plan[i].trans;     //n day에 이용할 교통수단

        // console.log("\n-------------day" + i + " place list");
        // console.log(place);
        // console.log("\n-------------day" + i + " trans list");
        // console.log(trans);

        let place_day = i + 1;

        //전체 place 관광지 입력
        for (var j = 0; j < place.length; j++) {
            let place_count = j + 1;

            //console.log(place[j]);

            if (!place[j].place_latitude || !place[j].place_longitude) {
                res.status(500).send({
                    message : "Null Value : longtitude and latitude"
                });
            } else {
                let insertPlaceQuery = 'INSERT INTO place VALUES (null, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
                let insertPlaceResult = await db.queryParam_Arr(insertPlaceQuery, [place_day, place_count, place[j].place_name, place[j].place_comment, place[j].place_latitude, place[j].place_longitude, place[j].place_budget, place[j].place_img, board_idx]);
            
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

        //전체 trans 입력
        for (var j = 0; j < trans.length; j++) {
            if (!trans[j].trans_dep_time || !trans[j].trans_arr_time) {
                res.status(500).send({
                    message : "Null Value : longtitude and latitude"
                });
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
    }  
    let setBoardBudgetQuery = 'UPDATE board SET board_budget = ? WHERE board_idx = ?';
    let setBoardBudgetResult = await db.queryParam_Arr(setBoardBudgetQuery, [totalBudget, board_idx]);

    if (!setBoardBudgetResult) {
        res.status(500).send({
            message : "Internal Server Error : update board budget"
        });

    } else {
        res.status(200).send({
            message : "Successfully Insert Board and Place and Trans Data"
        });
    }
});

//계획서 수정
router.put('/', async (req, res) => {
    let token = req.headers.token;
    let decoded = jwt.verify(token);

    let user_idx = decoded.user_idx;
    let board_idx = req.body.board_idx;
    let plan = req.body.plan;

    let totalBudget = 0;

    for (var i = 0; i < plan.length; i++) {
        let place = plan[i].place;     //n day에 갈 장소들
        let trans = plan[i].trans;     //n day에 이용할 교통수단

        let place_day = i + 1;

        let cntPastPlaceQuery = 'SELECT COUNT(*) as pp FROM place WHERE board_idx = ? AND place_day = ?';
        let cntPastPlaceResult = await db.queryParam_Arr(cntPastPlaceQuery, [board_idx, place_day]);

        let past_place_cnt = parseInt(cntPastPlaceResult[0].pp);


        //전체 place 관광지 수정
        for (var j = 0; j < place.length; j++) {
            let place_count = j + 1;

            if (!place[j].place_latitude || !place[j].place_longitude) {
                res.status(500).send({
                    message : "Null Value : longtitude and latitude"
                });
            } else {
                if (j < past_place_cnt) {  //기존의 장소 수정
                    let updatePlaceQuery = 'UPDATE place SET place_name = ?, place_comment = ?, place_latitude = ?, place_longitude = ?, place_budget = ?, place_img = ? WHERE board_idx =? AND place_day = ? AND place_count = ?';
                    let updatePlaceResult = await db.queryParam_Arr(updatePlaceQuery, [place[j].place_name, place[j].place_comment, place[j].place_latitude, place[j].place_longitude, place[j].place_budget, place[j].place_img, board_idx, place_day, place_count]);

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
                    let insertPlaceResult = await db.queryParam_Arr(insertPlaceQuery, [place_day, place_count, place[j].place_name, place[j].place_comment, place[j].place_latitude, place[j].place_longitude, place[j].place_budget, place[j].place_img, board_idx]);
                
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
        }

        let cntPastTransQuery = 'SELECT COUNT(*) as pt FROM transportation WHERE board_idx = ? AND trans_day = ?';
        let cntPastTransResult = await db.queryParam_Arr(cntPastTransQuery, [board_idx, place_day]);

        let past_trans_cnt = parseInt(cntPastTransResult[0].pt);

        //전체 trans 입력
        for (var j = 0; j < trans.length; j++) {
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

});

router.delete('/', async (req, res) => {
    let board_idx = req.body.board_idx;

    if (!board_idx) {
        res.status(500).send({
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
