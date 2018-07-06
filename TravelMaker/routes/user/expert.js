const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

//해당 나라의 전문가 보이기
router.get('/:country_name', async (req, res) => {
    let country_name = req.params.country_name;
    

    console.log("나라 이름 : " + country_name);

    if (!country_name) {
        res.status(500).send({
            message : "Null Value : country name"
        });
    } else {
        let selectExpertQuery = "SELECT * FROM user WHERE expert_city1 LIKE ? OR expert_city2 LIKE ? OR expert_city3 LIKE ?";
        let selectExpertResult = await db.queryParam_Arr(selectExpertQuery, [country_name + "%", country_name + "%", country_name + "%"]);

        if (!selectExpertResult) {
            res.status(500).send({
                message : "Internal Server Error : select expert"
            });
        } else {
            res.status(200).send({
                message : "Succeddfully Get Expert Data",
                expert : selectExpertResult
            });
        }
    }
});

module.exports = router;

