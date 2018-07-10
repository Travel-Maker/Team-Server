var express = require('express');
var router = express.Router();

const moment = require('moment');
const db = require('../../module/pool.js');			// queryParam_None, queryParam_Arr 두 개의 메소드
const jwt = require('../../module/jwt.js');

//특정 board의 코멘트 보기
router.get('/:board_idx', async (req,res) => {
    let board_idx = req.params.board_idx;

    if (!board_idx) {
        res.status(400).send({
            message : "Null Value : board index"
        });
    }

    let getCommentQuery = "SELECT * FROM comment where board_idx = ? ORDER BY comment_idx DESC";
    let getComment = await db.queryParam_Arr(getCommentQuery, [board_idx]);

    if(!getComment){
        res.status(500).send({
            message : "Internal Server Error" 
        });
    } else{
        res.status(200).send({
            message : "Successfully Get Comment Data",
            data : getComment
        });
    }
})

//전문가가 코멘트 작성
router.post('/', async (req, res) => {
    let token = req.headers.token;
    let decoded = jwt.verify(token);

    let user_idx = decoded.user_idx;
    //let user_idx = req.body.user_idx;
    let comment_content = req.body.comment_content;
    let board_idx = req.body.board_idx;
    let comment_writetime = moment().format('YYYY-MM-DD hh:mm:ss');

    console.log(req.body);

    if(!comment_content || !board_idx || !user_idx){
        res.status(400).send({
            message : "Null Value"
        })
    } else{
        let insertCommentQuery = "INSERT INTO comment (comment_content, board_idx, user_idx, comment_writetime) VALUES (?,?,?,?)";
        let insertCommentResult = await db.queryParam_Arr(insertCommentQuery, [comment_content, board_idx, user_idx, comment_writetime]);

        console.log(insertCommentResult);

        if(!insertCommentResult){
            res.status(500).send({
                message : "Internal Server Error : insert comment error"
            })
        } else{
            res.status(201).send({
                message : "Successfully Register Comment Data",
                comment_idx : insertCommentResult.insertId
            })
        }
    }
})

//코멘트 수정
router.put('/', async (req, res) => {
    let comment_idx = req.body.comment_idx;
    let comment_content = req.body.comment_content;
    let comment_writetime = moment().format('YYYY-MM-DD hh:mm:ss');

    if(!comment_content || !comment_idx ){
        res.status(400).send({
            message : "Null Value : comment update"
        })
    } else{
        let updateCommentQuery = "UPDATE comment SET comment_content = ?, comment_writetime = ? WHERE comment_idx = ?";
        let updateCommentResult = await db.queryParam_Arr(updateCommentQuery, [comment_content, comment_writetime, comment_idx]);

        console.log(updateCommentResult);

        if(!updateCommentResult){
            res.status(500).send({
                message : "Internal Server Error : update comment error"
            })
        } else{
            res.status(201).send({
                message : "Successfully Update Comment Data" 
            })
        }
    }
});

//코멘트 삭제
router.delete('/', async (req, res)=>{
	let comment_idx = req.body.comment_idx;

	let checkCommentQuery = "SELECT comment_idx FROM comment where comment_idx = ?";
	let checkComment = await db.queryParam_Arr(checkCommentQuery,[comment_idx]);

	if(!checkComment){
		res.status(500).send({
			message : "Internal Server Error : Invalid comment_idx"
		})
	} else if(checkComment.length == 1){
		let deleteCommentQuery = "DELETE FROM comment where comment_idx = ?";
		let deleteComment = await db.queryParam_Arr(deleteCommentQuery, [comment_idx]);

		if(!deleteComment){
			res.status(500).send({
				message : "Internal Server Error"
			})
		} else{
			res.status(201).send({
				message : "Successfully Delete Comment Data"
			})
		}
	}
	
});

module.exports = router;
