const utils  = require('./utils.js')
var pool = require('./trueMysql.js')
const cryptoRandomString = require('crypto-random-string');
/*
Return object
{
    Success : false/true,
    ERR_MSG za false || MSG za true
}
*/
//Pogledaj u bazi vezu izmedju data i round

//double conn open?
function joinRoomSQL(socket,room,username,localData){
    if(localData[room]['playerCount'] > Object.keys(localData[room]['playersID']).length){
        pool.getConnection((err,connection) =>{
            if(err){
                
                console.log(`ERROR CONNECTING TO THE DATABASE : Code ${err.code}\mMSG : ${err.sqlMessage}`)
                socket.emit('joinRoomSQLResponse',{'Success' : false,
                    "Data" : "Doslo je do problema sa pridruzivanjem u sobu, pokusajte kasnije!"
                })
                
            }else{

                //IF REJOIN ()..
                //Ovde prvo query da se vidida li postoji username u sobi, ako ne postoji moze ako postoji mora drugo ime //koristi proceduru
                connection.query(`select username from player where roomCode = '${room}' and username = '${username}';`,(err,result,fields) =>{
                    
                    if(err){
                        console.log(`ERROR WHILE SELECTING USERNAME FROM DATABASE : Code ${err.code}\nMSG : ${err.sqlMessage}`)
                        socket.emit('joinRoomSQLResponse',{'Success' : false,
                            "ERR_MSG" : "Doslo je do problema , pokusajte kasnije!" 
                            
                        })
                        /*
                        connection.query(`insert into error values(DEFAULT,'mysql.js','joinRoomSQL','${err.stack}','${JSON.stringify(
                            {
                                'localData' : localData[room],
                                'room' : room,                                
                                'username' : username
                            }
                        )}','Format sobe ili username nije validan?')`,(err,result,fields) =>{
                            if(err){

                            }
                        })
                        */
                    }else{
                        //console.log(result.length)
                        if(result.length ==0){
                            
                        //ovde proveri results lol.
                                let sessionToken = cryptoRandomString({length: 48, type: 'base64'})
                                connection.query(`insert into player values(DEFAULT,'${room}','${username}','${sessionToken}');`, (err,results,fields) =>{
                                    if(err){
                                        console.log(`ERROR WHILE INSERTING PLAYER INTO DATABASE : Code ${err.code}\nMSG : ${err.sqlMessage}`)
                                        if(err.code =="ER_NO_REFERENCED_ROW_2" ){
                                            socket.emit('joinRoomSQLResponse',{'Success' : false,
                                                "ERR_MSG": "Soba ne postoji!",
                                            
                                            })
                                        }else
                                            socket.emit('joinRoomSQLResponse',{'Success' : false,
                                                "ERR_MSG": "Doslo je do problema , pokusajte kasnije!",
                                                
                                            })
                                    }
                                    else{
                                        
                                        localData[room]['players'][username] = results.insertId
                                        localData[room]['playersID'][results.insertId] = username
                                        
                                        //socket join neka bude kada se poveze na game socket.join(room)
                                        socket.emit('joinRoomSQLResponse',{'Success' : true,
                                            'username': username,
                                            'roomCode': room,
                                            'sessionToken': sessionToken
                                        })
                                    }
                                } )
                                
                            
                        }
                        else{
                            
                                socket.emit('joinRoomSQLResponse',{'Success':false,
                                    "ERR_MSG": "Korisnicko ime u toj sobi vec postoji, izaberite drugo korisnicko ime!"
                                })
                            
                        }
                        
                        //pokrij ovo na klijentu
                        //socket.emit('joinRoomSQLResponse',{'Success' : true,
                            //'/roomCode': room   
                        //})
                        //socket.to(room).broadcast.emit('joinMessage',`${username} has joined the room!`)
                
                    }
                })
            }
            connection.release()
        })
    }else
        socket.emit('joinRoomSQLResponse',{'Success':false,
            "ERR_MSG" : "Soba je puna!"
        })
}

function createRoom(socket,username,playerCount,roundTimeLimit,localData){
   
    //Prvo se kreira soba , pa se pravi igrac, pa se pravi runda kada se svi pridruze!
    // kada su svi ready
   
    /*
    con.connect( err => {
            if (err){ 
                console.log(err.sqlMessage)
                throw err
            }
            con.query("SELECT * FROM room",  (err, result, fields) => {
                if (err){
                    c
                    console.log(err.sqlMessage)
                    throw err
                }                               
                console.log(result)
                socket.emit('message',result)
            });
            
        })
    */
  
            createRoomCode().then((response) =>{
                pool.getConnection((err,connection) => {
                    if (err) 
                    {
                        console.log(`ERROR WHILE CONNECTING TO THE DATABASE : Code : ${err.code}\nMSG : ${err.sqlMessage}`)
                        socket.emit('createRoomSQLResponse',{"Success": false,
                            "ERR_MSG": "Problem prilikom kreiranje sobe, pokusajte kasnije!",
                            
                        })
                    }      
                    else{
                        let sessionToken = cryptoRandomString({length: 48, type: 'base64'})
                        let sql = `insert into room values(DEFAULT,'${response}',${playerCount},NOW(),0);insert into player values(DEFAULT,'${response}','${username}','${sessionToken}');`;
                        
                        let trueRes =0;
                        
                        connection.query(sql, function (err, results) {
                            if (err){
                                //ER_DUP_ENTRY for duplicate entry
                                console.log(`ERROR WHILE INSERTING VALUES INTO ROOM : Code : ${err.code}\nMSG : ${err.sqlMessage}`)
                                /*return {"Success": false,
                                    "Data": "There was problem creating room, please try again later"
                                }*/
                                
                                //// TODO AKO ERR proveri koji error -> ako je room exist error
                                //-> ili sve stavi u jednu funckiju a ne dve da moram da cekam
                                //bolje ovo uradi..
                                socket.emit('createRoomSQLResponse',{
                                    'Success': false,
                                    "ERR_MSG ": "Problem prilikom kreiranje sobe, pokusajte kasnije!"
                                }) 

                            }else{           
                                console.log("Room creation successfull!")
                                //socket.join(response)
                                
                                
                                localData[response] = {
                                    'playerCount' : playerCount,
                                    'playersReady' : 0,
                                    'roundNumber' : 1,
                                    'roundTimeLimit': Number(roundTimeLimit),
                                    'roundActive' : false,
                                    'roundID': null,
                                    'players' : {},
                                    'playersID' : {},
                                    'intervalObj' : null,
                                    'availableLetters':["a","b","c","č","ć","d","dž","đ","e","f","g","h","i","j","k","l","lj","m","n","nj","o","p","r","s","š","t","u","v","z","ž"],
                                    'currentLetter': '',
                                    'data': {}
                                    
                                }
                                localData[response]['players'][username] = results[1].insertId
                                localData[response]['playersID'][results[1].insertId] = username
                                socket.emit('createRoomSQLResponse',{'Success':true,
                                        //'Data':result,
                                        
                                        'roomCode':response,
                                        'username': username,
                                        'sessionToken': sessionToken
                                    })
                            }
                            
                        });
                    }
                    connection.release()
                })
            
            },(reject)=>{
                console.log("There was problem while creating room code!")
                socket.emit('createRoomSQLResponse',{'Success' : false,               
                    'ERR_MSG' : "Problem prilikom kreiranje sobe, pokusajte ponovo!"
                })
            
            })

}

function joinRoom(socket,room,username,sessionToken,localData,io){

    pool.getConnection((err,connection) =>{
        if(err){
            console.log(`ERROR CONNECTING TO THE DATABASE : Code ${err.code}\mMSG : ${err.sqlMessage}`)
            socket.emit('load',{'Success' : false,
                "ERR_MSG" : "Problem prilikom ulaska u sobu!"
            })
        }else{
            //proveri da li postoji username
            console.log(username);
            console.log(room)
            
            connection.query(`select username from player where roomCode = '${room}' and username = '${username}';select sessionToken from player where roomCode = '${room}' and username = '${username}';select SUM(bodovi) as ukupnoBodova from data join player on data.playerID = player.playerID where roomCode = '${room}' and username = '${username}';`,(err,result,fields)=>{
                if(err){
                    console.log(`ERROR SELECTING USERNAME FROM PLAYER : Code ${err.code}\nMSG : ${err.sqlMessage}`)
                    socket.emit('load',{'Success' : false,
                        "ERR_MSG" : "Problem prilikom ulaska u sobu!"
                    })
                }
                else{
                    
                    if(result[0].length == 0 || result[1].length == 0){
                        socket.emit('load',{'Success':false,
                            "ERR_MSG" : "Korisnicko ime u sobi ne postoji!"
                        })
                    }else{
                        socket.join(room)
                        if(result[1][0]['sessionToken'] === sessionToken){
                            
                            if(result[2][0]['ukupnoBodova'] === null)
                                socket.emit('load',{'Success' : true,
                                "MSG" : `Upesan ulazak u sobu : ${room}`,
                                "playerCount" : localData[room]['playerCount'],
                                "playersReady" : localData[room]['playersReady'],
                                "roundActive" : localData[room]['roundActive'],
                                "roundNumber" : localData[room]['roundNumber'],
                                "points" : 0,
                                
                            })
                            else
                                socket.emit('load',{'Success' : true,
                                    "MSG" : `Upesan ulazak u sobu : ${room}`,
                                    "playerCount" : localData[room]['playerCount'],
                                    "playersReady" : localData[room]['playersReady'],
                                    "roundActive" : localData[room]['roundActive'],
                                    "roundNumber" : localData[room]['roundNumber'],
                                    "points" : result[2][0]['ukupnoBodova'],                                   
                                })
                            console.log('ROOM : ' + room)
                            socket.to(room).broadcast.emit('playerJoinMsg',`${username} just joined the room!`)
                            io.to(room).emit('playerList',{'players': Object.keys(localData[room]['players'])})
                        }else{
                            socket.emit('load',{'Success':false,
                                'ERR_MSG' : 'Nije moguce vratiti se u sobu nakon ulaska u drugu sobu!'
                            })
                        }

                        
                    }
                }
            })
        }
        connection.release()
    })
}

function createRoomCode() {
    return new Promise(function(resolve, reject) {
        values = ['Q','q','W','w','e','E','R','r','T','t','Y','y','U','u','I','i','O','o','P','p','A','a','S','s','D','d','F','f','G','g','H','h','J','j','K','k','L','l','Z','z','X','x','C','c','V','v','B','b','N','n','M','m','0','1','2','3','4','5','6','7','8','9']
        res =''
        for(let i =0;i<8;i++){
            res +=(values[Math.floor(Math.random() * values .length)])
        }
        if(res.length == 8)
            resolve(res)
        else
            reject(null)
        
    })
    
}



module.exports = {
    createRoom,
    joinRoomSQL,
    joinRoom

}