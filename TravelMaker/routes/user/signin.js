const express = require('express');
const router = express.Router();
		
const db = require('../../module/pool.js');
const jwt = require('../../module/jwt.js');

router.post('/', async (req, res) => {
    let user_id = req.body.user_id;

    if (!user_id) {
        console.log("NULL");
        res.status(400).send( {
            message : "Null Value"
        })
    } else {
        let checkQuery = 'SELECT * FROM user WHERE user_id = ?';
        let checkResult = await db.queryParam_Arr(checkQuery, [user_id]);

        if (!checkResult) {
            res.status(500).send( {
                message : "Internal Server Error"
            })
        } else if (checkResult.length == 1) {
            
            let token = jwt.sign(checkResult[0].user_idx);

            res.status(201).send({
                message : "Login Success",
                data : {
					'checkResult' : checkResult,
					'token' : token
                }
            });
    
        } else {
            console.log("id error");
            res.status(400).send( {
                message : "Login Failed : Id error"
            });
        }

    }
});

module.exports = router;