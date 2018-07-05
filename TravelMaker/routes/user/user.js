const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

//해당 나라의 전문가 보이기
router.get('/:country_idx', async (req, res) => {
    let country_idx = req.params.country_idx;

    if (!country_idx) {
        res.status(500).send({
            message : "Null Value : country_idx"
        });
    } else {
        let selectExpertQuery = "SELECT u.* FROM expert_city as ec JOIN user as u ON ec.expert_idx = u.user_idx WHERE ec.city_idx in (SELECT city_idx FROM city WHERE country_idx = ?) "
        let selectExpertResult = await db.queryParam_Arr(selectExpertQuery, [country_idx]);

        if (!selectExpertResult) {
            res.status(500).send({
                message : "Internal Server Error : select expert"
            });
        }
    }
});

module.exports = router;

