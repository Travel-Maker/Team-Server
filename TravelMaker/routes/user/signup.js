const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const s3 = new aws.S3();
aws.config.loadFromPath('./config/aws_config.json');
const upload = require('../../config/multer.js');

router.post('/', upload.single('user_img'), async (req, res) => {
    let user_id = req.body.user_id;
    let user_name = req.body.user_name;
    let user_age = req.body.user_age;
    let user_gender = req.body.user_gender;
    let user_nick = req.body.user_nick;
    let user_email = req.body.user_email;
    let user_style = req.body.user_style;
    let user_img = req.file.location;

    console.log("id : " + user_id +  " // user_nick : " + user_nick);

    if (!user_id || !user_name || !user_age || !user_gender || !user_nick || !user_email || ! user_style) {
        console.log("NULL");
        res.status(400).send( {
            message : "Null Value"
        })
    } else {
        //입력받은 user_nick가 원래 있는지 검사
        let checkNickQuery = 'SELECT * FROM user WHERE user_nick = ?';
        let checkNickResult = await db.queryParam_Arr(checkNickQuery, [user_nick]);

        if (!checkNickResult) {
            res.status(500).send( {
                message : "Internal Server Error_1"
            })
        } else if (checkNickResult.length == 1) {
            console.log("Nickname is already");
            res.status(400).send( {
                message : "User Nickname Already Exists"
            });
        } else {
            //users table에 새로운 user 등록
            let insertQuery = 'INSERT INTO user (user_id, user_name, user_age, user_gender, user_nick, user_email, user_style, user_img) values ( ?, ?, ?, ?, ?, ?, ?, ?)';
            let insertResult = await db.queryParam_Arr(insertQuery, [user_id, user_name, user_age, user_gender, user_nick, user_email, user_style, user_img]);
       
            if (!insertResult) {
                console.log("DB Insert Error");
                res.status(500).send( {
                    massage : "Internal Server Error : DB Insert"
                })
            } else {    //정상적으로 회원가입 완료
                console.log("Signin Success");
                res.status(201).send ( {
                    message : "Successfully Sign up"
                })
            }
        }
    }
});

module.exports = router;