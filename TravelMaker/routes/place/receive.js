const express = require('express');
const router = express.Router();

const db = require('../../module/pool.js');

router.post('/', async (req, res) => {
    let token = req.headers.token;
	let decoded = jwt.verify(token);

    let user_idx = decoded.user_idx;
    
    let selectPlanQuery = 'SELECT * FROM board WHERE expert_id = ?';
    let selectPlanReault = await db.queryParam_Arr(selectPlanQuery, [user_idx]);

    if (!selectPlanReault) {
        res.status(500).send({
            'message' : "Internal Server Error"
        });
    } else {
        res.status(200).send({
            message : "Successful Get Board Data",
            receive_board : selectPlanReault
        });
        
    }
});

router.get('/:board_idx', async (req, res) => {
    //해당 일정에 대한 플랜과 교통 + 시티
    let board_idx = req.params.board_idx;

    let selcetPlacesQuery = 'SELECT * FROM plan WHERE board_idx = ?';
    let selcetPlacesResult = await db.queryParam_Arr(selcetPlacesQuery, [board_idx]);

    console.log("selcetPlacesResult : " + selcetPlacesResult);

    if (!selcetPlacesResult) {
        console.log("place select error");
        res.status(500).send({
            message : "Internal Server Error : select places"
        });
    } else {
        let selectCityQuery = 'SELECT * FROM city WHERE city_idx = ?';
        let selectCityResult = await db.queryParam_Arr(selectCityQuery, [selectCityQuery]); //특정 board에 해당하는 city이름 가져옴

        let selcetTransQuery = 'SELECT * FROM transportation WHERE place_idx = ?';  //특정 board에 해당하는 일정들 모두 불러오기
        let selcetTransResult;

        for (var i = 0; i < selectPlanReault.length; i++) {
            let selectResult = await db.queryParam_Arr(selcetTransQuery, [selcetPlacesResult[i].place_idx]);    //모든 일정에 대한 교통수단 불러오기
            
            if (!selectResult) {
                console.log("transportation select error");
                res.status(500).send({
                    message : "Internal Server Error : select transportation"
               });
            } else {
                selcetTransResult.push(selectResult);
            }
        }

        res.status(200).send({
            message : "Successfully Get Comment Places",
            totalPlaces : selcetPlacesResult, 
            totalTransportation : selcetTransResult
        });
    }
});
module.exports = router;