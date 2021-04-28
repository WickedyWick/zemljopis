const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const app = express()
const {createRoom,joinRoomSQL,joinRoom} = require('./public/javascripts/mysql.js')
const server = app.listen(3000)
const io = socketio(server)
const {playerReady, playerUnReady,timeout,dataCollector,evaluation,predlagac,startVoteKick,voteKickCounter,historyReq}  = require('./public/javascripts/utils.js')
var path = require('path')
localData = {}
katDict = {'d':0,'g':1,'i':2,'b':3,'z':4,'p':5,'r':6,'pr':7}
sockets = {}
app.use('/public', express.static('public'));
// Run when client connects
io.on('connection', socket => {
    console.log('New WS Connection ...')
    sockets[String(socket.id)] = {}    
    socket.on('test',test=>{
        console.log(test);
    });
    socket.on('joinRoomSQL',({username,room}) =>{  
        joinRoomSQL(socket,room,username,localData)
    })
    socket.on('joinRoomSQLM',(obj)=>{
        joinRoomSQL(socket,obj['room'],obj['username'],localData);       
    })
    socket.on('createRoom',({username,playerCount,roundTimeLimit}) =>{        
        createRoom(socket,username,playerCount,roundTimeLimit,localData)        
    })
    socket.on('createRoomM', (obj)=>{
        createRoom(socket,obj['username'],obj['playerCount'],obj['roundTimeLimit'],localData) 
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
    socket.on('predlagac',({val,currentLetter,k})=>{
        try{            
            predlagac(val,currentLetter,katDict[k])
        }catch{
            console.log("error with predlagac")
        }
    })
    //socket.to().broadcast('test,')
    //socket.emit('message','Welcome')
    //socket.broadcast.to
    //socket.join
    //Broadcast when a user connects
    //razlika izmedju ovoga i obicnog emnita je da se ovo emituje svima sem useru    
    //socket.broadcast.emit('message','User has joined the chat')
    //io.emit() SVI korisnici   
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
    socket.on('voteKickCounter',({username,roomCode,mode})=>{
        voteKickCounter(roomCode,username,mode,localData,socket,io)
    })
    socket.on("clientEndRoundM",obj =>{
        clearTimeout(localData[obj["roomCode"]]['intervalObj'])
        const temp = setTimeout(evaluation, 7000, obj["roomCode"],localData,io);
        localData[obj["roomCode"]]['intervalObj'] = temp
        dataCollector(io,obj["username"],obj["roomCode"],obj["data"],obj["roundNumber"],localData,socket)   
        socket.to(roomCode).emit('roundEnd',{'Success': true,
        'MSG' : "Round end! Evaluation started!",
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
        try{
            io.to(sockets[socket.id]['room']).emit("playerLeft",`${sockets[socket.id]['username']} je izašao iz sobe`)  
            socket.leave(sockets[socket.id]['room'])            
            if(sockets[socket.id]['ready'])  
                playerUnReady(sockets[socket.id]['room'],localData,socket,io,"DISC",sockets)                
            else                 
                delete sockets[socket.id]            
        }catch(err){
            console.log(`Error during dissconnecting\nErr : ${err}`)
        }
        
        
    })
    socket.on('historyReq',({roomCode,player,targetRound})=>{       
        
        historyReq(roomCode,player,targetRound,localData,socket)
    })
    
    
})
console.log('Server started!')

app.get('/',(req,res) => {
    res.sendFile('./views/index.html', {root: __dirname})
})

app.get('/about',(req,res) => {
    res.sendFile('./views/about.html', {root: __dirname})
})

app.get('/game', (req,res) => {
    
    res.sendFile('./views/game.html', {root : __dirname})
    
})

app.use((req,res) =>{
    res.status(404).sendFile('./views/404.html', {root: __dirname})
})