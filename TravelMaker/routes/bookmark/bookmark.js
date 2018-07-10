var express = require('express');
var router = express.Router();

const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

router.post('/', async (req, res) => {
    let token = req.headers.token;
	let decoded = jwt.verify(token);

    let user_idx = decoded.user_idx;

    //country 북마크는 country idx를 가져다 주고
    //expert 북마크는 유저 정보 주기

    if (!user_idx) {
        res.status(400).send({
            message : "Null Value : No user_idx input"
        });
    } else {
        let selectCountryQuery = 'SELECT country_idx FROM bookmark_country WHERE user_idx = ?';
        let selectCountryResult = await db.queryParam_Arr(selectCountryQuery, [user_idx]);

        let selectExpertQuery = 'SELECT u.* FROM user as u JOIN bookmark_expert as bme ON u.user_idx = bme.expert_idx WHERE bme.user_idx = ?';
        let selectExpertResult = await db.queryParam_Arr(selectExpertQuery, [user_idx]);

        if (!selectCountryResult || !selectExpertResult) {
            res.status(500).send({
                message : "Internal Server Error : select bookmarks error"
            });
        } else {
            res.status(200).send({
                message : "Successfully Select BookmarkList Data",
                country : selectCountryResult,
                expert : selectExpertResult
            });
        }
    }
})



module.exports = router;
