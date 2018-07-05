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

//관광지 추가
router.post('/', upload.array('place_img'), async (req, res) => {
    let plan_idx = parseInt(req.body.plan_idx);
    let place_day = parseInt(req.body.place_day);
    let place_count = parseInt(req.body.place_count);
    let place_name = req.body.place_name;
    let place_comment = req.body.place_comment;
    let place_latitude = parseFloat(req.body.place_latitude);
    let place_longtitude = parseFloat(req.body.place_longtitude);
    let place_budget = parseInt(req.body.place_budget);
    let place_img = req.files[0].location;

    if (!plan_idx || !place_day || !place_count || !place_latitude || !place_longtitude || !place_name) {
        console.log("place add data null");
        res.status(500).send({
            message : "Null Value"
        });
    } else {
        let insertPlaceQuery = 'INSERT INTO place VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?)';
        let insertPlaceResult = await db.queryParam_Arr(insertPlaceQuery, [place_day, place_count, place_name, place_comment, place_latitude, place_longtitude, place_budget, place_img, plan_idx]);

        if (!insertPlaceResult) {
            console.log("place insert error");
            res.status(500).send({
                message : "Internel Server Error : Place Insert"
            });
        } else {
            res.status(200).send({
                message : "Successfully Insert Place Data",
                isertPlace : insertPlaceResult
            });
        }
    }
});

//관광지 삭제
router.delete('/', async (req, res) => {
    let place_idx = req.body.place_idx;

});

//관관지 수정

module.exports = router;