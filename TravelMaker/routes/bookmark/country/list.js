var express = require('express');
var router = express.Router();

const db = require('../../../module/pool.js');
const jwt = require('../../../module/jwt.js');

router.post('/', async (req, res) => {
    // let token = req.headers.token;
	// let decoded = jwt.verify(token);

    // let user_idx = decoded.user_idx;
    let user_idx = req.body.user_idx;

    let getBookmarkListQuery = "SELECT bmc.bookmark_idx, c.* FROM country as c JOIN bookmark_country as bmc ON bmc.country_idx = c.country_idx WHERE bmc.user_idx = ?";
    let getBookmarkList = await db.queryParam_Arr(getBookmarkListQuery, [user_idx]);

    if(!getBookmarkList){
        res.status(500).send({
            msg : "Internal Server Error"
        })
    } else{
        res.status(200).send({
            msg : "Successfully Get BoardList Data",
            data : getBookmarkList
        })
    }
})



module.exports = router;
