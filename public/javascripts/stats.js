var pool = require('./trueMysql.js')

function getRooms(){
    pool.query("select count(roomID) as result from room" ,(err,results,fields)=>{
        if(err){
            console.log(`Error while getting total room count : ERR : ${err.sqlMessage}\nCODE : ${err.code}`)
            res.statusCode(500).json({"ERROR":"ERROR"})
        }else{
            if(results.length == 0){
                res.statusCode(200).json({"Count":0})
            }else{
                res.statusCode(200).json({"Count":results[0]['result']})    
            }
        }
    })
}
function getRoomsAtDate(){
    pool.query("select count(roomID) from room where room.dateCreated = ?" ,date,(err,results,fields)=>{
        if(err){
            console.log(`Error while getting total room count at date: ERR : ${err.sqlMessage}\nCODE : ${err.code}`)
            res.statusCode(500).json({"ERROR":"ERROR"})
        }else{
            if(results.length == 0){
                res.statusCode(200).json({"Count":0})
            }else{
                res.statusCode(200).json({"Count":results[0]['result']})    
            }
        }
    })
}
function getRoomsBetweenDates(){
    pool.query("select count(roomID) from room where (room.dateCreated between ? and ?)" ,[date1,date2],(err,results,fields)=>{
        if(err){
            console.log(`Error while getting total player count : ERR : ${err.sqlMessage}\nCODE : ${err.code}`)
            res.statusCode(500).json({"ERROR":"ERROR"})
        }else{
            if(results.length == 0){
                res.statusCode(200).json({"Count":0})
            }else{
                res.statusCode(200).json({"Count":results[0]['result']})    
            }
        }
    })
}
function getRounds(res){
    pool.query("select count(roundID) as result from round" ,(err,results,fields)=>{
        if(err){
            console.log(`Error while getting total round count : ERR : ${err.sqlMessage}\nCODE : ${err.code}`)
            res.statusCode(500).json({"ERROR":"ERROR"})
        }else{
            if(results.length == 0){
                res.statusCode(200).json({"Count":0})
            }else{
                res.statusCode(200).json({"Count":results[0]['result']})    
            }
        }
    })
}
function getRoundsAtDate(res,date){
    pool.query("select count(roundID) from round join room on round.roomCode = room.roomCode where room.dateCreated = ?" ,date,(err,results,fields)=>{
        if(err){
            console.log(`Error while getting total round count at date: ERR : ${err.sqlMessage}\nCODE : ${err.code}`)
            res.statusCode(500).json({"ERROR":"ERROR"})
        }else{
            if(results.length == 0){
                res.statusCode(200).json({"Count":0})
            }else{
                res.statusCode(200).json({"Count":results[0]['result']})    
            }
        }
    })
}
function getRoundsBetweenDates(){
    pool.query("select count(roundID) from round join room on round.roomCode = room.roomCode where (room.dateCreated between ? and ?)" ,[date1,date2],(err,results,fields)=>{
        if(err){
            console.log(`Error while getting total round count between dates : ERR : ${err.sqlMessage}\nCODE : ${err.code}`)
            res.statusCode(500).json({"ERROR":"ERROR"})
        }else{
            if(results.length == 0){
                res.statusCode(200).json({"Count":0})
            }else{
                res.statusCode(200).json({"Count":results[0]['result']})    
            }
        }
    })
}
function getPlayers(res){
    pool.query("select count(playerID) as result from player" ,(err,results,fields)=>{
        if(err){
            console.log(`Error while getting total player count : ERR : ${err.sqlMessage}\nCODE : ${err.code}`)
            res.statusCode(500).json({"ERROR":"ERROR"})
        }else{
            if(results.length == 0){
                res.statusCode(200).json({"Count":0})
            }else{
                res.statusCode(200).json({"Count":results[0]['result']})    
            }
        }
    })
}
function getPlayersAtDate(res,date){
    pool.query("select count(playerID) from player join room on player.roomCode = room.roomCode where room.dateCreated = ?" ,date,(err,results,fields)=>{
        if(err){
            console.log(`Error while getting total player count : ERR : ${err.sqlMessage}\nCODE : ${err.code}`)
            res.statusCode(500).json({"ERROR":"ERROR"})
        }else{
            if(results.length == 0){
                res.statusCode(200).json({"Count":0})
            }else{
                res.statusCode(200).json({"Count":results[0]['result']})    
            }
        }
    })
}
function getPlayersBetweenDates(res,date1,date2){
    //between je inclusive sa obe strane
    pool.query("select count(playerID) from player join room on player.roomCode = room.roomCode where (room.dateCreated between ? and ?)" ,[date1,date2],(err,results,fields)=>{
        if(err){
            console.log(`Error while getting total player count : ERR : ${err.sqlMessage}\nCODE : ${err.code}`)
            res.statusCode(500).json({"ERROR":"ERROR"})
        }else{
            if(results.length == 0){
                res.statusCode(200).json({"Count":0})
            }else{
                res.statusCode(200).json({"Count":results[0]['result']})    
            }
        }
    })
}

module.exports ={
    getRooms,
    getRoomsAtDate,
    getRoomsBetweenDates,
    getRounds,
    getRoundsAtDate,
    getRoundsBetweenDates,
    getPlayers,
    getPlayersAtDate,
    getPlayersBetweenDates
}