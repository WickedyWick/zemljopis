const perf = require('perf_hooks')
const e = require('express')
var pool = require('./trueMysql.js')
const { strict } = require('assert')
function playerReady(room,localData,socket,io){
    //console.log("PLAYERS REAADY : " + localData[room]['playersReady'])
    //console.log("PLAYER COUNT : " + localData[room]['playerCount'])
    if(localData[room]['playersReady'] < localData[room]['playerCount'])
    {
           
        //send to everyone after 
        io.to(room).emit('playerCountUpdate',localData[room]['playersReady'] += 1)
        
        
        //socket.to(room).broadcast.emit('test',temp)
        if(localData[room]['playersReady'] == localData[room]['playerCount']){
            //game starts
            //TODO start game endgine with timers
            //setuj interval i povezi svaki intervral id sa sobom
            socket.emit('playerReadyResponse',{'Success' : true,
                "MSG" : "Successful ready up!",
                "STATE" : "Ready",
                "CODE" : 1
                
            })
            
            createRound(room,io,localData)
        }
        else
            //send back positive feedback about readying up
            socket.emit('playerReadyResponse',{'Success' : true,
                "MSG" : "Successful ready up!" ,
                "STATE" : "Ready",
                "CODE" : 1

        })
        
    }   
    else
    {
        console.log("server error")
        localData[room]['playersReady'] = 0
        socket.to(room).broadcast.emit('playerReadyResponse',{'Success' : false,
            "ERR_MSG" : `There was error with the room. Everyone set to not ready!`,
            "ERR_CODE" : 1
        })
    }

}

function createRound(room,io,localData){
    pool.getConnection((err,connection) =>{
        if(err){
            console.log(`ERROR CONNECTING TO THE DATABASE RUDING CREATING ROUND : Code ${err.code}\nMSG : ${err.sqlMessage}`)           
        }else{
            chooseLetter(room,localData).then((response)=>{
                connection.query('insert into round values(DEFAULT,?,?,?)',[localData[room]['roundNumber'],room,response],(err,results,fields)=>{
                    if(err){
                        console.log(`ERROR CREATING ROUND : Code ${err.code}\nMSG : ${err.sqlMessage}`)
                    }else{                     
                        localData[room]['roundActive'] = true
                        console.log("ROUND START:")
                        localData[room]['roundID'] = results.insertId
                        io.to(room).emit("gameStartNotification",{'Success' : true,
                                    "MSG" : "Everyone is ready, game will start shortly!",
                                    "currentLetter":response,
                                    "CODE" : 1
                                })
                                
                        const temp = setTimeout(timeout, localData[room]['roundTimeLimit']*1000, room,localData,io);
                        //var temp = setTimeout(timeout,,room,localData,io)
                        localData[room]['intervalObj'] = temp    
                        
                    }
                    
                })
                
                
            },reject =>{
                console.log("ERROR " , reject)
            })
            
            

        }
    })
}

function chooseLetter(room,localData){
    
    return new Promise((resolve,reject)=>{
       
                //prebaci selectovanje u drugu funkciju da moze da zove ponovo ako slovo vec postoji
                
                        //result je niz dictionarija
        //values = ["a","b","c","č","ć","d","dž","đ","e","f","g","h","i","j","k","l","lj","m","n","nj","o","p","r","s","š","t","u","v","z","ž"]
        //ili ubaci niz dostupnih slova (jer sto vise rundi to veca sansa da se ponove slova)
        letter = (localData[room]['availableLetters'][Math.floor(Math.random() * localData[room]['availableLetters'].length)])
        // save this in dict memory
        
        let index = localData[room]['availableLetters'].indexOf(letter)
        if(index !== -1){
            localData[room]['availableLetters'].splice(index,1)
            localData[room]['currentLetter'] = letter
            resolve(letter)
        }
        reject("No more letter left, game over!")
        
        
       
                    
                
    })
}

function playerUnReady(room,localData,socket,io){
    if(localData[room]['playersReady'] > 0 && localData[room]['playersReady'] <= localData[room]['playerCount']){
        //KADA PLAYER UNREADUJE - DISCONECTUJE neka dobije neki status code da mora da ceka drugu rundu!
        io.to(room).emit('playerCountUpdate',localData[room]['playersReady'] -= 1)
        
        socket.emit('playerReadyResponse',{'Success' : true,
                "MSG" : "Successful un-ready!" ,
                "STATE" : "Not ready!",
                "CODE" : 1
        })
    }
    else
    {
        console.log("server error")
        localData[room]['playersReady'] = 0
        io.to(room).emit('playerReadyResponse',{'Success' : false,
            "ERR_MSG" : `There was error with the room. Everyone set to not ready!`,
            "ERR_CODE" : 1
        })
    }
}
fieldKeys = ['drzava','grad','ime','biljka','zivotinja','planina','reka','predmet']
function evaluation(room,localData,io){
    t0 = perf.performance.now()
    if(localData[room]['roundActive']){ //ovi ifovi u slucaju da se se nekako evaluation funkcije u isto vreme pozovu
        console.log('evaluation STARTED')
        localData[room]['roundActive'] = false  
        localData[room]['playersReady'] = 0
        localData[room]['roundNumber']+=1
        
        clearTimeout(localData[room]['intervalObj'])
        
        mysqlData = {'drzava':[],
                    'grad':[],
                    'ime':[],
                    'biljka':[],
                    'zivotinja':[],
                    'planina':[],
                    'reka':[],
                    'predmet':[]

            }
        pool.getConnection((err,connection) =>{
            if(err){
                console.log(`There was an error getting connection in evaluation function. Code : ${err.code} MSG: ${err.sqlMessage} `)
            }else{
            let slovo = localData[room]['currentLetter'];
         
            connection.query(`select naziv from drzava where slovo = '${slovo}'; select naziv from grad where slovo = '${slovo}'; select naziv from ime where slovo = '${slovo}'; select naziv from biljka where slovo = '${slovo}'; select naziv from zivotinja where slovo = '${slovo}';select naziv from planina where slovo = '${slovo}';select naziv from reka where slovo = '${slovo}';select naziv from predmet where slovo = '${slovo}';`,(err,results)=>{
                if(err){
                    console.log(`ERROR WHILE SELECTING FROM DATABASE : Code : ${err.code}\nMSG : ${err.sqlMessage}`)
                    io.to(room).emit('points',{'Success' : false,
                            "ERR_MSG" : 'There was an error during evaluation!',                           
                            "ERR_CODE" : 3
                            })
                }
                else{
                    for(let i=0;i<results.length;i++){
                        results[i].forEach(element => mysqlData[fieldKeys[i]].push(element['naziv']))
                    }
                                                    
                    //1. uporedi sve i dodeli poene vrednostima
                    playerIDKeys = Object.keys(localData[room]['data'])
                    //make it global 
                    
                    data = {'drzava': {},
                            'grad': {},
                            'ime' : {},
                            'biljka' : {},
                            'zivotinja' : {},
                            'planina' : {},
                            'reka' : {},
                            'predmet':{}
                                }           
                    points = {}
                    
                    //probaj prvo da preborjis koliko se puta rec ponavlja
                    for(let i =0;i<playerIDKeys.length;i++){
                        let temp = localData[room]['data'][playerIDKeys[i]] // data niz
                        points[playerIDKeys[i]] = 0
                        for(let j=0;j<fieldKeys.length;j++){   
                            
                            if(data[fieldKeys[j]][temp[j]] === undefined){
                                data[fieldKeys[j]][temp[j]] = [1,playerIDKeys[i]]
                            }else
                            {
                                data[fieldKeys[j]][temp[j]][0] += 1
                                data[fieldKeys[j]][temp[j]].push(playerIDKeys[i])
                            }
                        }
                    }
                   
                    // za svaki prebrojan rezultat ]
                    for(let i =0;i<fieldKeys.length;i++){
                        fieldCountKeys = Object.keys(data[fieldKeys[i]])
                        for(let j=0;j<fieldCountKeys.length;j++){
                            if(!mysqlData[fieldKeys[i]].includes(fieldCountKeys[j]))
                                delete data[fieldKeys[i]][fieldCountKeys[j]]
                        }
                    }
                    
                    for(let i =0;i<fieldKeys.length;i++){
                        fieldCountKeys = Object.keys(data[fieldKeys[i]])
                        //ako je jedini odgovor +20
                        if(fieldCountKeys.length == 1 && fieldCountKeys[0][0] == 1){                   
                            points[fieldCountKeys[0][1]] +=20
                        }else{
                            for(let j=0;j<fieldCountKeys.length;j++){
                                let temp = data[fieldKeys[i]][fieldCountKeys[j]]
                                if(temp[0] == 1){
                                    for(let k =1;k<temp.length;k++){
                                        points[temp[k]] += 10
                                    }                 
                                }
                                else if(temp[0] > 1){
                                    for(let k =1;k<temp.length;k++){
                                        points[temp[k]] += 5
                                    }   
                                }
                            }
                        }
                    }
                    //reverse points
                    uPoints = {}
                    let sql = ""
                
                    
                    // upoints ne radi (sawpuj points value/key)
                    for(let i=0;i<playerIDKeys.length;i++){
                        uPoints[localData[room]['playersID'][playerIDKeys[i]]] = points[playerIDKeys[i]]
                        sql +=`update data set bodovi = ${points[playerIDKeys[i]]} where playerID = ${playerIDKeys[i]} and roundID = ${localData[room]['roundID']};`
                    }
                
                    
                    connection.query(sql,(err,results)=>{
                        
                        if(err){
                            console.log(`ERROR WHILE UPDATING POINTS INTO THE DATABASE : Code :${err.code}\nMSG : ${err.sqlMessage}` )
                            io.to(room).emit('points',{'Success' : false,
                            'roundNumber' : localData[room]['roundNumber'],
                            'playersReady' : localData[room]['playersReady'] ,
                            "MSG" : "Error during evaluationuation",
                            })
                        }else{
                            io.to(room).emit('points',{'Success' : true,
                            "MSG" : 'evaluationuation finished',
                            'roundNumber' : localData[room]['roundNumber'],
                            'playersReady' : localData[room]['playersReady'] ,
                            "DATA" : uPoints
                            })
                        }
                        localData[room]['data'] = {}
                        t1 = perf.performance.now();
                        console.log(`TIME : ${t1-t0}ms`)
                    })
                }
            })
            }
            connection.release()
            
        })
        }
}   


function dataCollector(io,username,room,data,round,localData){   
    console.log("DATA COLLECTOR FUNKCIJA")
    //OVDE POGLEDAJ DOKLE OCE!!!!
    if(localData[room]['data'][localData[room]['players'][username]] === undefined && round == localData[room]['roundNumber']){
        
        pool.query(`insert into data values(DEFAULT,${localData[room]['roundID']},${localData[room]['players'][username]},?,?,?,?,?,?,?,?,0)`,data,(err,results,fields)=>{
            if(err){
                console.log(`Error while inserting data values : Code : ${err.code}\nMSG: ${err.sqlMessage}`)
                localData[room]['data'][localData[room]['players'][username]] = new Array(8).fill('')
            }else{
                localData[room]['data'][localData[room]['players'][username]] = data                       
                        console.log(`Data recieved for : ${username} \n${data}`)
                        keys = Object.keys(localData[room]['data'])
                        if(keys.length == localData[room]['playerCount'])
                            if(localData[room]['roundActive'])
                            {
                                
                                evaluation(room,localData,io)
                                
                                //clearuj interval i dodaj interval funckicju sa evaluationom na round end eventovima
                            }
            }
        })    
        
}

function endRound(room,localData,io){
    
}




}   
function miniTimeout(){

}

function timeout(room,localData,io){
        //castuj ovo od requesta klijenta
        //za sada fino radi :3
        
        
        //neka roundEnd bude request da clienti posalju podatke

        //do ovde radi
        io.to(room).emit('roundEnd',{'Success': true,
        'MSG' : "Round end! evaluationuation started!",        
        'CODE' : 2
        })
                
        clearTimeout(localData[room]['intervalObj'])
        const temp = setTimeout(evaluation, 7000, room,localData,io);
        localData[room]['intervalObj'] = temp

    
}

/*
function startRound(room,localData,io,letter){
    localData[room]['roundActive'] = true
    console.log("GAME START:")
    //localData[room]['currentLetter'] = letter
    io.to(room).emit("gameStartNotification",{'Success' : true,
                "MSG" : "Everyone is ready, game will start shortly!",
                "currentLetter":letter,
                "CODE" : 1
            })
            
    const temp = setTimeout(timeout, localData[room]['roundTimeLimit']*1000, room,localData,io);
    //var temp = setTimeout(timeout,,room,localData,io)
    localData[room]['intervalObj'] = temp
}
*/


module.exports = {
    playerReady,
    playerUnReady,
    timeout,
    dataCollector,
    evaluation
    
}