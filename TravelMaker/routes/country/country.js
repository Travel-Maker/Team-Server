const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

router.get('/:country_idx', async (req, res) => {
    let country_idx = req.params.country_idx;
    console.log("country index : " + country_idx);

    if (!country_idx) {
        res.status(400).send({
            message : "Null Value : country_idx"
        });
    } else {
         //1. 국가 정보 가져오기
        let getCountryQuery = 'SELECT * FROM country WHERE country_idx = ?';
        let getCountryResult = await db.queryParam_Arr(getCountryQuery, country_idx);
        //console.log(getCountryResult);

        if (!getCountryResult) {
            res.status(500).send({
                message : "Internal Server Error : select country error"
            });
        } else if (getCountryResult.length == 1){
            let country_name = getCountryResult[0].country_name;

            let getExpertQuery = 'SELECT * FROM user WHERE expert_city1 LIKE ? OR expert_city2 LIKE ? OR expert_city3 LIKE ?'
            let getExpertResult = await db.queryParam_Arr(getExpertQuery, [country_name + "%", country_name + "%", country_name + "%"]);
           // console.log(getExpertResult);

           let getBoardQuery = 'SELECT board_idx, board_title FROM board WHERE country_idx = ? ORDER BY board_idx DESC'
           let getBoardResult = await db.queryParam_Arr(getBoardQuery, [country_idx]);
            //console.log(getBoardResult);

            let board_data = new Array();

            for (var i = 0; i < getBoardResult.length; i++) {
                
                let getBoardCommentQuery = 'SELECT count(*) comment_count FROM comment WHERE board_idx = ?';
                let getBoardComment = await db.queryParam_Arr(getBoardCommentQuery, [getBoardResult[i].board_idx])

                getBoardResult[i].comment_count = getBoardComment[0].comment_count;
            }

            res.status(200).send({
                message : "Seccessfully Get Country Data",
                country_info : getCountryResult,
                expert_info : getExpertResult,
                board_info : getBoardResult
            });
        } else {
            res.status(500).send({
                message : "Internal Server Error"
            });
        }

    }

   
});

module.exports = router;