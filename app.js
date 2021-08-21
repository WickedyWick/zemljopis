const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const app = express()
const {createRoom,joinRoomSQL,joinRoom} = require('./public/javascripts/mysql.js')
const server = app.listen(3000)
const io = socketio(server)
const cron = require("node-cron")
let moment = require("moment")
require('dotenv').config({path: __dirname + '/.env'})
const {playerReady, playerUnReady,timeout,dataCollector,evaluation,predlagac,startVoteKick,voteKickCounter,historyReq,returnRoom,insertUtisak}  = require('./public/javascripts/utils.js')
const {getRooms,getRoomsAtDate,getRoomsBetweenDates,getRounds,getRoundsAtDate,getRoundsBetweenDates,getPlayers,getPlayersAtDate,getPlayersBetweenDates} = require("./public/javascripts/stats.js")
var path = require('path')

const times = ['60','90','120']
localData = {}
sockets = {}
katDict = {'d':0,'g':1,'i':2,'b':3,'z':4,'p':5,'r':6,'pr':7}
app.use('/public', express.static('public'));
app.use(express.json());
cron.schedule("0 12 * * *",()=>{
    console.log("****** Running Cron Job ******")
    console.log("Cleaning localData") 
    let date = new Date();  
    let currentMoment = moment([date.getFullYear(),date.getMonth()+1,date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds()])
    Object.keys(localData).forEach(key =>{
        if(currentMoment.diff(localData[key]['momentCreated'],'hours') > 6){
            delete localData[key]
        }
    });
})
cron.schedule("0 0 * * *",()=>{
    cconsole.log("****** Running Cron Job ******")
    console.log("Cleaning localData") 
    let date = new Date();  
    let currentMoment = moment([date.getFullYear(),date.getMonth()+1,date.getDate(),date.getHours(),date.getMinutes(),date.getSeconds()])
    Object.keys(localData).forEach(key =>{
        if(currentMoment.diff(localData[key]['momentCreated'],'seconds') > 6){
            delete localData[key]
        }
    });
})
// Run when client connects
io.on('connection', socket => {
    console.log('New WS Connection ...')
    sockets[String(socket.id)] = {}
    /*
    socket.on('joinRoomSQL',({username,room}) =>{  
        joinRoomSQL(socket,room,username,localData)
    })*/
    socket.on('joinRoomSQLM',(obj)=>{
        joinRoomSQL(socket,obj['room'],obj['username'],localData,io);       
    })
    /*
    socket.on('createRoom',({username,playerCount,roundTimeLimit}) =>{        
        createRoom(socket,username,playerCount,roundTimeLimit,localData,io)        
    })*/
    socket.on('createRoomM', (obj)=>{
        createRoom(socket,obj['username'],obj['playerCount'],obj['roundTimeLimit'],localData,io) 
    })
    socket.on('joinRoomReq',({username,roomCode,sessionToken}) =>{        
        joinRoom(socket,roomCode,username,sessionToken,localData,io)       
    })
    socket.on('joinRoomReqM',(obj) =>{
        joinRoom(socket,obj["roomCode"],obj["username"],obj["sessionToken"],localData,io)        
    })
    socket.on('predlagacM',(obj)=>{
        try{
            predlagac(obj["predlog"],obj["slovo"],katDict[obj["kategorija"]])
        }catch{
            console.log("error with predlagac")
        }
    })
    socket.on("disc",key =>{
        if(process.env.REG_KEY === key)
            io.of('/').in(key).clients(function(error, clients){
                if (error) console.log(error);
                    for(var i=0; i <clients.length; i++){
                io.sockets.connected[clients[i]].disconnect(true)
                }
            // console.log(io.sockets.adapter.rooms["TESTKEY"]['sockets'])
                socket.disconnect(true);
            })
        
    })
    socket.on("register", key =>{
        //console.log("registered")
        
        //if(io.sockets.adapter.rooms[key]['sockets']
        if(process.env.REG_KEY === key)
            io.of('/').in(key).clients(function(error, clients){
                if (error) console.log(error);
                    for(var i=0; i <clients.length; i++){
                io.sockets.connected[clients[i]].disconnect(true)
                }
                socket.join(key);
            // console.log(io.sockets.adapter.rooms[key]['sockets'])
            })
        
        
    })
    
    socket.on('predlagac',({val,currentLetter,k})=>{
        try{            
            predlagac(val,currentLetter,katDict[k])
        }catch(err){
            console.error(`${new Date()}error with predlagac: Err : ${err}\nValue : ${val}\nCurrentLetter ${currentLetter}\nKategorija : ${k}`)
            io.to(process.env.REG_KEY).emit("notification",{"msg":"Predlagac function error"
            ,"line":119
            ,"file":"app"
        })
        }
    })
  
    socket.on('playerUnReady',roomCode =>{
        playerUnReady(roomCode,localData,socket,io,"BTN",sockets)
    })
    socket.on('playerReady',roomCode =>{       
        playerReady(roomCode,localData,socket,io,sockets)       
    })
    socket.on('clientEndRound',({username,roomCode,data,roundNumber}) =>{
        clearTimeout(localData[roomCode]['intervalObj'])
        const temp = setTimeout(evaluation, 7000, roomCode,localData,io);
        localData[roomCode]['intervalObj'] = temp
        dataCollector(io,username,roomCode,data,roundNumber,localData,socket)
        socket.to(roomCode).emit('roundEnd',{'Success': true,
        'MSG' : "Round end! Evaluation started!",
        'CODE' : 2
        })
        
    })
    socket.on('voteKickStart',({usernameM,roomCode})=>{
        startVoteKick(roomCode,usernameM,localData,socket,io)
    })
    socket.on("voteKickStartM",(obj)=>{
        startVoteKick(obj['roomCode'],obj['usernameM'],localData,socket,io);
    })
    socket.on('voteKickCounter',({username,roomCode,mode})=>{
        voteKickCounter(roomCode,username,mode,localData,socket,io)
    })
    socket.on("voteKickCounterM",(obj)=>{
        
        voteKickCounter(obj['roomCode'],obj['username'],obj['mode'],localData,socket,io);
    })
    socket.on("clientEndRoundM",obj =>{
        clearTimeout(localData[obj["roomCode"]]['intervalObj'])
        const temp = setTimeout(evaluation, 7000, obj["roomCode"],localData,io);
        localData[obj["roomCode"]]['intervalObj'] = temp
        dataCollector(io,obj["username"],obj["roomCode"],obj["data"],obj["roundNumber"],localData,socket)   
        socket.to(obj["roomCode"]).emit('roundEnd',{'Success': true,
        'MSG' : "Runda završena, evaluacija počinje!",
        'CODE' : 2
        })
    }); 
    socket.on('roundData',({username,roomCode,data,roundNumber}) =>{
 
        dataCollector(io,username,roomCode,data,roundNumber,localData,socket)
    })
    socket.on('roundDataM',(obj)=>{
        dataCollector(io,obj['username'],obj['roomCode'],obj['data'],obj['roundNumber'],localData,socket)
    })
    socket.on('disconnect',() => {
        //console.log("dissconect");
       // console.log(sockets)
        try{
            io.to(sockets[socket.id]['room']).emit("playerLeft",`${sockets[socket.id]['username']} je izašao iz sobe`)  
            socket.leave(sockets[socket.id]['room'])            
            if(sockets[socket.id]['ready'])  
                playerUnReady(sockets[socket.id]['room'],localData,socket,io,"DISC",sockets)                
            else                 
                delete sockets[socket.id]            
        }catch(err){
            console.error(`${new Date()}error during dissconecting: Err : ${err}`)
            io.to(process.env.REG_KEY).emit("notification",{"msg":"Predlagac function error"
            ,"line":183
            ,"file":"app"
            })
        }
      //  console.log(sockets)
        
    })
    socket.on('historyReq',({roomCode,player,targetRound})=>{       
        
        historyReq(roomCode,player,targetRound,localData,socket)
    })
    socket.on('historyReqM',(obj)=>{        
        historyReq(obj['roomCode'],obj['player'],obj['targetRound'],localData,socket)
    })
    /*
    socket.on("returnRoom",sessionToken =>{
        returnRoom(sessionToken, localData, socket)
    })*/

    
})
console.log('Server started!')
app.get('/favicon.ico',(req,res)=>{
    res.setHeader("Content-Type" ,"text/html; charset=UTF-8")
    res.sendFile("./favicon.ico",{root:__dirname})
})
app.get('/',(req,res) => {
    res.setHeader("Content-Type" ,"text/html; charset=UTF-8")
    res.sendFile('./views/index.html', {root: __dirname})
})
/*
app.get("/test",(req,res)=>{
    
    res.setHeader("Content-Type","text/html; charset=UTF-8")
    res.sendFile("./views/404.html")
})*/
app.get('/uputstvo',(req,res) => {
    res.setHeader("Content-Type" ,"text/html; charset=UTF-8")
    res.sendFile('./views/uputstvo.html', {root: __dirname})
})
app.get('/utisci',(req,res)=>{
    res.setHeader("Content-Type","text/html;charset=UTF-8")
    res.sendFile("./views/utisci.html",{root:__dirname})
})
app.get('/android',(req,res)=>{
    res.setHeader("Content-Type","text/html; charset=UTF-8")
    res.sendFile("./views/android.html",{root: __dirname})
})
app.get('/game', (req,res) => {    
    res.setHeader("Content-Type" ,"text/html; charset=UTF-8")
    res.sendFile('./views/game.html', {root : __dirname})    
})
app.get('/about',(req,res)=>{
    res.setHeader("Content-Type" ,"text/html; charset=UTF-8")
    res.sendFile('./views/about.html' , {root: __dirname})
})
app.get('/loaderio-7f60fd2d4c10aaa9f33aded96b50c574',(req,res)=>{
    res.sendFile('./views/loaderio-7f60fd2d4c10aaa9f33aded96b50c574.txt',{root:__dirname})
})
app.get('/returnRoom/:sessionToken',(req,res)=>{   
    returnRoom(res,req.params.sessionToken,localData)
})
app.get('/admin/:key/:action/:date?/:toDate?',(req,res) =>{
    if(req.params.key == process.env.ADMIN_TOKEN){
        //actions:
        //number of Rooms Created
        //number Of Rooms Created At Certain date
        //number Of Rooms Created Between 2 dates
        //number of Rounds created
        //number Of Rounds created At Certain date
        //number Of rounds Created Between 2 dates
        //number of players registered
        //number of players registered at certain date
        //number of players registered between 2 dates
        //number of clients connected
        if(req.params.action == "room"){
            if(req.params.date != undefined){
                if(req.params.toDate != undefined){
                    
                    getRoomsBetweenDates(res,req.params.date,req.params.toDate)
                }else
                    getRoomsAtDate(res,req.params.date)
            }else
                getRooms(res)
        }
        else if(req.params.action == "player"){
            if(req.params.date != undefined){
                if(req.params.toDate != undefined){
                    getPlayersBetweenDates(res,req.params.date,req.params.toDate)
                }else
                    getPlayersAtDate(res,req.params.date)
            }else
                getPlayers(res)
        }else if(req.params.action == "round"){
            if(req.params.date != undefined){
                if(req.params.toDate != undefined){
                    getRoundsBetweenDates(res,req.params.date,req.params.toDate)
                }else
                    getRoundsAtDate(res,req.params.date)
            }else
                getRounds(res)
        }
        
    }else{
        
        res.status(403).send("<h1>403 FORBIDDEN</h1>")
    }

})
app.post('/createRoom/',(req,res)=>{
    //vrv bolje da bude  regex novi kreiran za svaki req zbog g flaga jer ako u isto vreme se pozove regex.test , lastindex = -1 nece mozda stici na vreme , GC ce valjda obrisati ovo nakon koriscenja
    //ovde se jedino regexuje jer 
    let usernameRegEx = /^[A-Za-zа-шА-ШčČćĆžŽšŠđĐђјљњћџЂЈЉЊЋЏ ]{4,30}$/g
    let playerCountRegEx = /^[1-8]{1}$/g
    if(usernameRegEx.test(req.body['username']) && playerCountRegEx.test(req.body['playerCount']) && times.includes(req.body['roundTimeLimit']))
        createRoom(res,req.body.username,req.body.playerCount,req.body.roundTimeLimit,localData,io)
    else{
        res.statusCode = 400
        res.setHeader("Content-Type", "application/json");
        res.json({"ERR_MSG":"Invalid parameters"})
    }
})
app.post('/joinRoomSQL/',(req,res) =>{
    joinRoomSQL(res,req.body.roomCode,req.body.username,localData);
})
app.post('/utisak/',(req,res)=>{
    
    insertUtisak(res,req.body.utisak)
})
//app.use(require('express-status-monitor')());
app.use((req,res) =>{
    res.status(404).sendFile('./views/404.html', {root: __dirname})
})