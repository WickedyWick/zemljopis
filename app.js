const express = require('express')
const http = require('http')
const socketio = require('socket.io')
const app = express()
const {createRoom,joinRoomSQL,joinRoom} = require('./public/javascripts/mysql.js')
//kreatuje server
const server = app.listen(3000)
const io = socketio(server)
const {playerReady, playerUnReady,timeout,dataCollector,evaluation}  = require('./public/javascripts/utils.js')
var path = require('path')
//TODO 
// Manipualte localData propertly
// DODAJ Language pack u player
localData = {}

// roomCode : {
//   playerCount : x,
//   playersReady : y
// }
// popuni sve to kad se soba kreira
// playeReady na clientov zahtev za dugme +-  pa onda pC == pR pa pocni

app.use('/public', express.static('public'));
// Run when client connects
io.on('connection', socket => {
    console.log('New WS Connection ...')
    
    socket.on('joinRoomSQL',({username,room}) =>{
        //socket.emit('message',`Welcome to the room ${room}`)
        //socket.broadcast.emit('message',`${username} has joined the chat`)
        
        //socket.join(room)
        joinRoomSQL(socket,room,username,localData)
        //vuci iz baze sada sve
    })
    socket.on('createRoom',({username,playerCount,roundTimeLimit}) =>{
        createRoom(socket,username,playerCount,roundTimeLimit,localData)
    })
    socket.on('joinRoomReq',({username,roomCode,sessionToken}) =>{
        joinRoom(socket,roomCode,username,sessionToken,localData)
    })
    //socket.to().broadcast('test,')
    //socket.emit('message','Welcome')
    //socket.broadcast.to
    //socket.join
    //Broadcast when a user connects
    //razlika izmedju ovoga i obicnog emnita je da se ovo emituje svima sem useru    
    //socket.broadcast.emit('message','User has joined the chat')
    //io.emit() SVI korisnici

    //Runs when clients disconnects
    socket.on('disconnectMSG',({username,roomCode}) =>{
        socket.to(roomCode).broadcast.emit('discMessage', `${username} has just left the room!`)
        playerUnReady(roomCode,localData,socket,io)
    })
    socket.on('playerUnReady',roomCode =>{
        playerUnReady(roomCode,localData,socket,io)
    })
    socket.on('playerReady',roomCode =>{
        
        playerReady(roomCode,localData,socket,io)
    })
    socket.on('clientEndRound',({username,roomCode,data,roundNumber}) =>{
        clearTimeout(localData[roomCode]['intervalObj'])
        const temp = setTimeout(evaluation, 7000, roomCode,localData,io);
        localData[roomCode]['intervalObj'] = temp
        dataCollector(io,username,roomCode,data,roundNumber,localData)
        
        socket.to(roomCode).emit('roundEnd',{'Success': true,
        'MSG' : "Round end! Evaluation started!",
        'CODE' : 2
        })
        
    })
    //ovo su podaci za runde
    //kada svaki klijent posalje podatke neka se pogleda koliko njih je poslalo ima se 10 sekundi da svi posalju
    socket.on('roundData',({username,roomCode,data,roundNumber}) =>{
        
        dataCollector(io,username,roomCode,data,roundNumber,localData)
    })
    socket.on('disconnect',() => {
        
        //make this work 
        //io.emit('message','A user has left the chat')
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

//use i middleware funkcije
//use ce se aktivarati za svaki req kaserveru ali samo akododje do koda,znaci ako nijedno od gore nije aktivarana
// posto use func ne zna da mi saljemo specificno 404 error page moramo da stavimo i status kod
app.use((req,res) =>{
    res.status(404).sendFile('./views/404.html', {root: __dirname})
})