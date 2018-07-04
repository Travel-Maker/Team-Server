var express = require('express');
var router = express.Router();

const moment = require('moment');
const db = require('../../module/pool.js');			// queryParam_None, queryParam_Arr 두 개의 메소드
const jwt = require('../../module/jwt.js');

router.get('/:board_idx', async (req,res) => {
    let board_idx = req.params.board_idx;

    let getCommentQuery = "SELECT * FROM comment where board_idx = ? ORDER BY comment_idx DESC";
    let getComment = await db.queryParam_Arr(getCommentQuery, [board_idx]);

    if(!getComment){
        res.status(500).send({
            msg : "Internal Server Error" 
        })
    } else{
        res.status(200).send({
            msg : "Successfully Get Comment Data",
            data : getComment
        })
    }
})

router.post('/', async (req, res) => {
    let token = req.headers.token;
    let decoded = jwt.verify(token);

    let user_idx = decoded.user_idx;
    let comment_content = req.body.comment_content;
    let board_idx = req.body.board_idx;
    let comment_writetime = moment().format('YYYY-MM-DD hh:mm:ss');

    if(!comment_content || !board_idx || !user_idx || !comment_writetime){
        res.status(400).send({
            msg : "Null Value"
        })
    } else{
        let insertCommentQuery = "INSERT INTO comment(comment_content, board_idx, user_idx, comment_writetime) VALUES(?,?,?,?)";
        let insertComment = await db.queryParam_Arr(insertCommentQuery, [comment_content, board_idx, user_idx, comment_writetime]);

        if(!insertComment){
            res.status(500).send({
                msg : "Internal Server Error"
            })
        } else{
            res.status(201).send({
                msg : "Successfully Register Comment Data" 
            })
        }
    }
})

router.delete('/', async (req, res)=>{
	let comment_idx = req.body.comment_idx;

	let checkCommentQuery = "SELECT comment_idx FROM comment where comment_idx = ?";
	let checkComment = await db.queryParam_Arr(checkCommentQuery,[comment_idx]);

	if(!checkComment){
		res.status(500).send({
			msg : "Internal Server Error"
		})
	} else if(checkComment.length == 1){
		let deleteCommentQuery = "DELETE FROM comment where comment_idx = ?";
		let deleteComment = await db.queryParam_Arr(deleteCommentQuery, [comment_idx]);

		if(!deleteComment){
			res.status(500).send({
				msg : "Internal Server Error"
			})
		} else{
			res.status(201).send({
				msg : "Successfully Delete Comment Data"
			})
		}
	}
	
});

module.exports = router;
