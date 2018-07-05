const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

router.post('/', async (req, res) => {
    let searchQuery = 'SELECT * FROM country';
    let searchResult = await db.queryParam_None(searchQuery);

    if (!searchResult) {
        res.status(500).send({
            message : "Internal Server Error : search country"
        });
    } else {
        res.status(200).send({
            message : "Successfully Get Data",
            countries : searchResult
        });
    }
});

module.exports = router;
