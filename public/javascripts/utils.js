const perf = require('perf_hooks')
const e = require('express')
var pool = require('./trueMysql.js')
const { strict } = require('assert')
function playerReady(room,localData,socket,io,sockets){
    //console.log("PLAYERS REAADY : " + localData[room]['playersReady'])
    //console.log("PLAYER COUNT : " + localData[room]['playerCount'])
    if(room in localData){
        if(localData[room]['playersReady'] < localData[room]['playerCount'])
        {
            
            //send to everyone after 
            io.to(room).emit('playerCountUpdate',localData[room]['playersReady'] += 1)
            try{
                sockets[socket.id]['ready'] = true
            }catch(err){
                console.log(`Error while readying the socket\nErr : ${err}`)   
            }
            
            //socket.to(room).broadcast.emit('test',temp)
            if(localData[room]['playersReady'] == localData[room]['playerCount']){
                //game starts
                //TODO start game endgine with timers
                //setuj interval i povezi svaki intervral id sa sobom
                socket.emit('playerReadyResponse',{'Success' : true,
                    "MSG" : "Uspeh!",
                    "STATE" : "Spreman",
                    "CODE" : 1
                    
                })
                
                createRound(room,io,localData)
            }
            else
                //send back positive feedback about readying up
                socket.emit('playerReadyResponse',{'Success' : true,
                    "MSG" : "Uspeh!" ,
                    "STATE" : "Spreman",
                    "CODE" : 1

            })
            
        }   
        else
        {
            console.log("server error")
            localData[room]['playersReady'] = 0
            io.to(room).broadcast.emit('playerReadyResponse',{'Success' : false,
                "ERR_MSG" : `Problem! Svi u sobi NISU spremni ponovo!`,
                "ERR_CODE" : 1
            })
        }
    }else{
        socket.emit("roomNotExist","Soba više ne postoji , kreirajte novu!");
    }

}
function historyReq(room,username,round,localData,socket){
    
    if(room in localData){
        if(round in localData[room]['roundIDS']){ //
            pool.query(`Select drzava, grad, ime, biljka, zivotinja, planina, reka, predmet from data where roundID = ${localData[room]['roundIDS'][round]} and playerID = ${localData[room]['players'][username]}`,(err,results,fields)=>{
                if(err){
                    console.log(`THERE WAS AN ERROR WHILE SELECTING HISTORY:\nCODE : ${err.code}\nMSG : ${err.sqlMessage}`)
                    socket.emit("historyReqResponse",{"Success":false,
                        "ERR_MSG":"Došlo je do problema prilikom prikazivanja traženih podataka!"
                    })
                }else{
                    //console.log(results)
                    if(results.length==0){
                        socket.emit("historyReqResponse",{"Success":false,
                            "ERR_MSG": "Nema traženih podataka!"
                        })
                    }else{
                        socket.emit("historyReqResponse",{"Success":true,
                            "Data" : results[0],
                            "MSG" : "Podaci pronadjeni!",
                            "username" :username,
                            "round":round
                        })
                    }
                }
            })
        }else{
            console.log("ROUND DOESNT EXITST?!")
        }
    }else{
        socket.emit('roomNotExist',"Soba više ne postoji, kreirajte novu!")
    }
}
function createRound(room,io,localData){
    if(room in localData){
        pool.getConnection((err,connection) =>{
            if(err){
                console.log(`ERROR CONNECTING TO THE DATABASE RUDING CREATING ROUND : Code ${err.code}\nMSG : ${err.sqlMessage}`)           
            }else{
                chooseLetter(room,localData).then((response)=>{
                    connection.query('insert into round values(DEFAULT,?,?,?)',[localData[room]['roundNumber'],room,response],(err,results,fields)=>{
                        if(err){
                            console.log(`ERROR CREATING ROUND : Code ${err.code}\nMSG : ${err.sqlMessage}`)
                            //RESETUJ OVDE SVE
                            io.to(room).emit('createRoundResponse',{
                                "ERR_MSG" : "Problem pri kreiranju runde , pokusajte ponovo!"
                            })
                        }else{                     
                            localData[room]['roundActive'] = true
                            console.log("ROUND START:")
                            localData[room]['roundIDS'][localData[room]['roundNumber']] = results.insertId
                            localData[room]['roundID'] = results.insertId
                            localData[room]['playersReady'] = 0
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
                    io.to(room).emit('createRoomResponse',{
                        "ERR_MSG" : "Kraj igre, sva slova su iskorišćena!"
                    })
                })
                
                

            }
            connection.release()
        })
    }else
    socket.emit('roomNotExist',"Soba više ne postoji , kreirajte novu!")
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

function playerUnReady(room,localData,socket,io,mode,sockets){
    if(room in localData){
        if(localData[room]['playersReady'] > 0 && localData[room]['playersReady'] <= localData[room]['playerCount']){
            //KADA PLAYER UNREADUJE - DISCONECTUJE neka dobije neki status code da mora da ceka drugu rundu!
        
            io.to(room).emit('playerCountUpdate',localData[room]['playersReady'] -= 1)
            try{
                sockets[socket.id]['ready'] = false
            }catch(err){
                console.log(`Error while unreadying the socket\nErr : ${err}`)   
            }
            if(mode == "BTN")
                socket.emit('playerReadyResponse',{'Success' : true,
                        "MSG" : "Uspeh!" ,
                        "STATE" : "Nisi spreman",
                        "CODE" : 1
                })
            else if(mode == "DISC")
                delete sockets[socket.id]
        
        }
        else
        {
            console.log("server error")
            localData[room]['playersReady'] = 0
            io.to(room).emit('playerReadyResponse',{'Success' : false,
                "ERR_MSG" : `Problem! Svi u sobi NISU spremni ponovo!`,
                "ERR_CODE" : 1
            })
        }
    }else
    socket.emit('roomNotExist',"Soba više ne postoji , kreirajte novu!")
}
fieldKeys = ['drzava','grad','ime','biljka','zivotinja','planina','reka','predmet']

/*
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
        pool.getConnection((err,connection)=>{
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
*/
function evaluation(room,localData,io){
    //ovo se poziva dva puta??
    if(room in localData){
        try{
            if(localData[room]['roundActive']){
                clearTimeout(localData[room]['intervalObj'])
                localData[room]['evalFuncExecuting'] = true;
                localData[room]['roundActive'] = false  
                localData[room]['playersReady'] = 0
                localData[room]['roundNumber']+=1
                
                pool.getConnection((err,connection)=>{
                //ovi ifovi u slucaju da se se nekako evaluation funkcije u isto vreme pozovu
                    if(err)
                    {
                        console.log(`Doslo je do problema prilikom povezivanja na bazu podataka u evaluaciji! CODE : ${err.code} MSG : ${err.sqlMessage}`)
                        io.to(room).emit("evaluationResponse",{
                            "ERR_MSG" : "Doslo je problema prilikom evaluacije , runda ponistena!",
                            "roundNumber" : localData[room]['roundNumber'],
                            'playersReady': localData[room]['playersReady']
                        })
                        localData[room]['evalFuncExecuting'] = false;
                    }
                    else{
                        dataKeys = Object.keys(localData[room]['data'])
                        myDict = {  }
                        ids = {}
                        sql = `select naziv , kategorija ,oDataID from referencedata where slovo ='${localData[room]['currentLetter']   }' and (naziv`
                        for(let i =0;i < dataKeys.length;i++){
                            dataRow = localData[room]['data'][dataKeys[i]];
                            for(let j=0;j<dataRow.length;j++){
                                nazivPodatka = dataRow[j]
                                
                                if(nazivPodatka in myDict){
                                    if(j in myDict[nazivPodatka])
                                    {
                                        myDict[nazivPodatka][j]['count'] +=1
                                        myDict[nazivPodatka][j]['ids'].push(dataKeys[i])
                                        
                                    }
                                    else
                                    {
                                        myDict[nazivPodatka][j] = {}
                                        myDict[nazivPodatka][j]['count'] =1
                                        myDict[nazivPodatka][j]['ids'] = [dataKeys[i]]
                                    }
                                    
                                }else{
                                    myDict[nazivPodatka] ={}
                                    myDict[nazivPodatka][j] = {}
                                    myDict[nazivPodatka][j]['count'] =1
                                    myDict[nazivPodatka][j]['ids'] = [dataKeys[i]]
                                    sql+= '=? or naziv'
                                }
                            }
                            ids[dataKeys[i]] = 0
                        }
                        sql+= "='x')"
                    
                        naziviKeys = Object.keys(myDict)
                        otherDict = {}
                        connection.query(sql,naziviKeys,(err1,results,fields)=>{
                                
                                
                            /*  ovako results izlgeda
                                RowDataPacket { naziv: 'apatin', kategorija: 1, oDataID: 2701 },
                                RowDataPacket { naziv: 'alžir', kategorija: 1, oDataID: 2703 },
                                RowDataPacket { naziv: 'alzir', kategorija: 1, oDataID: 2703 },
                                RowDataPacket { naziv: 'aleksinac', kategorija: 1, oDataID: 2744 },
                                RowDataPacket { naziv: 'ada', kategorija: 1, oDataID: 2745 },
                                RowDataPacket { naziv: 'arilje', kategorija: 1, oDataID: 2748 },
                                RowDataPacket { naziv: 'adorjan', kategorija: 1, oDataID: 2753 },
                                RowDataPacket { naziv: 'aleksandrovo', kategorija: 1, oDataID: 2760 },
                                RowDataPacket { naziv: 'avganistan', kategorija: 0, oDataID: 5397 },
                                RowDataPacket { naziv: 'alžir', kategorija: 0, oDataID: 5400 },
                                RowDataPacket { naziv: 'alzir', kategorija: 0, oDataID: 5400 },
                                RowDataPacket { naziv: 'andora', kategorija: 0, oDataID: 5402 },
                                RowDataPacket { naziv: 'argentina', kategorija: 0, oDataID: 5404 },
                                RowDataPacket { naziv: 'australija', kategorija: 0, oDataID: 5405 },
                                RowDataPacket { naziv: 'austrija', kategorija: 0, oDataID: 5406 },
                                RowDataPacket { naziv: 'avala', kategorija: 5, oDataID: 5614 },
                                RowDataPacket { naziv: 'arnauta', kategorija: 6, oDataID: 5910 },
                                RowDataPacket { naziv: 'amazon', kategorija: 6, oDataID: 5913 },
                                RowDataPacket { naziv: 'ada', kategorija: 6, oDataID: 5922 },
                                RowDataPacket { naziv: 'ana', kategorija: 6, oDataID: 5925 },
                                RowDataPacket { naziv: 'artičoka', kategorija: 3, oDataID: 6295 },
                                RowDataPacket { naziv: 'ananas', kategorija: 3, oDataID: 6297 },
                                RowDataPacket { naziv: 'aronija', kategorija: 3, oDataID: 6298 },
                                RowDataPacket { naziv: 'anakonda', kategorija: 4, oDataID: 6762 },
                                RowDataPacket { naziv: 'aleksa', kategorija: 2, oDataID: 7188 },
                                RowDataPacket { naziv: 'aleksandar', kategorija: 2, oDataID: 7189 },
                                RowDataPacket { naziv: 'aleksej', kategorija: 2, oDataID: 7191 },
                                RowDataPacket { naziv: 'aleksandra', kategorija: 2, oDataID: 7212 },
                                RowDataPacket { naziv: 'ana', kategorija: 2, oDataID: 7214 },
                                RowDataPacket { naziv: 'anastasija', kategorija: 2, oDataID: 7215 }
                            */
                            
                            if(err1){
                                console.log(`Doslo je do problema prilikom selektovanja podataka u evaluaciji! CODE : ${err1.code} MSG : ${err1.sqlMessage}`)
                                
                                io.to(room).emit("evaluationResponse",{
                                    "ERR_MSG" : "Doslo je problema prilikom evaluacije , runda ponistena!",
                                    "roundNumber" : localData[room]['roundNumber'],
                                    'playersReady': localData[room]['playersReady']
                                })
                                localData[room]['evalFuncExecuting'] = false;
                            }
                            else{
                                for(let i =0;i<results.length;i++){
                                    oDataID = results[i]['oDataID']
                                    kategorija = results[i]['kategorija']
                                
                                
                                    naziv = results[i]['naziv']
                                
                                    if(naziv in myDict && kategorija in myDict[naziv]){
                                        if(oDataID in otherDict){
                                            otherDict[oDataID]['nazivi'].push(naziv)
                                            otherDict[oDataID]['points'] = 5
                                            otherDict[oDataID]['count'] += myDict[naziv][kategorija]['count']
                                            
                                        }else{
                                        otherDict[oDataID] = {}
                                        otherDict[oDataID]['nazivi'] = [naziv]
                                        otherDict[oDataID]['count'] = myDict[naziv][kategorija]['count']
                                        otherDict[oDataID]['kategorija'] = kategorija
                                        //overwrite myDict
                                        if(otherDict[oDataID]['count'] > 1)
                                        {
                                            for(let j=0;j<myDict[naziv][kategorija]['ids'].length;j++)
                                                ids[myDict[naziv][kategorija]['ids'][j]] +=5
                                            otherDict[oDataID]['points'] = 5
                                        }
                                        else
                                        {
                                            for(let j=0;j<myDict[naziv][kategorija]['ids'].length;j++)
                                                ids[myDict[naziv][kategorija]['ids'][j]] +=10
                                            otherDict[oDataID]['points'] = 10
                                        }   
                                        
                                        }
                                    }
                                }
                                
                                pointsDict = {}
                                pointsDict['result'] = {}
                                pointsDict['Success'] = true
                                pointsDict['roundNumber'] = localData[room]['roundNumber']
                                pointsDict['playersReady'] = localData[room]['playersReady']
                                otherDictKeys = Object.keys(otherDict)
                                /*kategroija{
                                    naziv : poeni
                                }
                                */
                                for(let i =0;i<otherDictKeys.length;i++){
                                    nazivi = otherDict[otherDictKeys[i]]['nazivi']
                                    kategorija = otherDict[otherDictKeys[i]]['kategorija']
                                    poeni = otherDict[otherDictKeys[i]]['points']
                                    if(!(kategorija in pointsDict['result']))
                                        pointsDict['result'][kategorija] = {}
                                    for(let j =0;j<nazivi.length;j++)
                                        pointsDict['result'][kategorija][nazivi[j]] = poeni
                                }

                            
                                //console.log(pointsDict);
                            
                                otherDictKeys = Object.keys(ids)
                                sql = ""
                                io.to(room).emit('points',pointsDict)
                                pointsDict ={}
                                names = localData[room]['playersID']
                                
                                for(let i =0;i<otherDictKeys.length;i++){
                                    sql += `Update data set bodovi = ${ids[otherDictKeys[i]]} where playerID = ${otherDictKeys[i]} and roundID = ${localData[room]['roundID']};`
                                    pointsDict[names[otherDictKeys[i]]] = ids[otherDictKeys[i]]
                                }
                                //console.log(ids);
                                io.to(room).emit("playerList",{'players':pointsDict,
                                            "MODE" : "UPDATE"
                                        })
                                localData[room]['evalFuncExecuting'] = false;
                                if(sql != "")
                                    connection.query(sql,(err,results,fields)=>{
                                        //Ne moram da cekam da se ovo zavrsi da bih poslao rezultate , ako ovde ima problem posaljem page refresh req tako da ce se refresovati stranica sama i poeni ce ostati kako treba
                                        if(err)
                                        {
                                            console.log(`Problem upisivanje bodova u bazu! MSG : Code : ${err.code}\nMSG: ${err.sqlMessage}`)
                                            //Dodaj jedan univerzalni err socket(ili to moze biti explotivano)
                                            io.to(room).emit('pointsErr',{"MSG":"Doslo je do problema sa upisivanjem bodova , poeni u rundi su nevazeći!"})
                                        }
                                        
                                    })
                                
                                localData[room]['data'] ={}
                                        
                            }
                        })
                    }
                    connection.release();
                })
            }
        }catch(err){
            console.log(err)        
            io.to(room).emit('points',{
                'Success':false,
                'roundNumber' : localData[room]['roundNumber'],
                'playersReady':localData[room]['playersReady']
            })
            localData[room]['evalFuncExecuting'] = false;
        }
    }else
    socket.emit('roomNotExist',"Soba više ne postoji , kreirajte novu!")
    
}


function dataCollector(io,username,room,data,round,localData,socket){   
        console.log("DATA COLLECTOR FUNKCIJA")
        //OVDE POGLEDAJ DOKLE OCE!!!!
        if(room in localData){
            if(localData[room]['data'][localData[room]['players'][username]] === undefined && round == localData[room]['roundNumber']){   
                console.log("IT GETS HERE");
                pool.query(`insert into data values(DEFAULT,${localData[room]['roundID']},${localData[room]['players'][username]},?,?,?,?,?,?,?,?,0)`,data,(err,results,fields)=>{
                    if(err){
                        console.log(`Error while inserting data values : Code : ${err.code}\nMSG: ${err.sqlMessage}`)
                        socket.to(room).emit("dataCollectorResponse",{
                            "ERR_MSG": "Doslo je do problema prilikom unosenja podataka, podaci nevažeci!"
                        })
                        //ovo dole mozda ne treba
                        //localData[room]['data'][localData[room]['players'][username]] = new Array(8).fill('')
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
        }else
        socket.emit('roomNotExist',"Soba više ne postoji , kreirajte novu!")

}   
function startVoteKick(room,username,localData,socket,io){
    if(room in localData){
        if(!('kickVote' in localData[room])){
            console.log(`VOTE KICK STARTED FOR : ${username}`)
            localData[room]['kickVote'] = {}
            localData[room]['kickVote']['username'] = username
            localData[room]['kickVote']['for'] = 0
            localData[room]['kickVote']['alreadyVoted'] = []
            localData[room]['kickVote']['totalVotes'] = 0
            localData[room]['kickVote']['timeoutID'] = setTimeout(kickEval,120000,room,localData,io)
            localData[room]['kickVote']['funcCalled'] = false // ovo je za 1% slucajeva kada se potrefi vreme timeouta i votekick countera da se ne bi funkcije 2 puta
            //cuvaj ovaj username na strani da ne bi mogao da glasas za pogresnog igraca nekako
            io.to(room).emit('startVoteKickResponse',{"Success" : true,
                "MSG": `Počelo je glasanje za izbacivanje igrača : ${username}`,                
                "username" : username})
        }else
            socket.emit("startVoteKickResponse",{"Success" : false,
                        "ERR_MSG" : "Glasanje za izbacivanje je već u toku sačekajte da se završi!"
                })
    }else{
        socket.emit("roomNotExist","Soba više ne postoji, kreirajte novu!");
    }
}

function kickEval(room,localData,io){
   if(!localData[room]['kickVote']['funcCalled'])
   {
       if(!localData[room]['evalFuncExecuting'])
       {
            localData[room]['kickVote']['funcCalled'] = true
            //postavi sql da je kicked =1
            //obrisi u player i playerID 
            //posalji IO 
            //ako je timer zvao onda je prekinutO ?:D
            console.log(localData[room])
            if(((localData[room]['kickVote']['for'] / localData[room]['playerCount']) *100 ) > 50){ // procenti
                username = localData[room]['kickVote']['username']
                pool.query("update player set kicked =1 where username = ?",[username],(err,results,fields)=>{
                    if(err){
                        console.log(`ERROR WHILE KICKING PLAYER : Code : ${err.code}\nMSG : ${err.sqlMessage}`)
                        io.to(room).emit("kickResult",{'Success':false,
                                "ERR_MSG": "Doslo je do problema prilikom izbacivanja igrača , pokušajte ponovo kasnije!"
                        })
                    }else{
                        
                        localData[room]['playerCount'] -= 1
                        io.to(room).emit("kickResult",{'Success':true,
                                "username" : username,
                                "MSG": "Igrač je izabačen!",
                                "SPEC_MSG" : "Izbačeni ste iz sobe!"
                        })
                        let tempID = localData[room]['players'][username]
                        delete localData[room]['players'][username]
                        delete localData[room]['playersID'][tempID]

                        delete localData[room]['kickVote']
                    }
                })
            }else{
                
                io.to(room).emit('kickResult',{'Success':false,
                    "ERR_MSG":"Glasanje završeno , nedovoljno glasova za izbacivanje!" 
                })
            }
        }else{
            // da ne bude problema prilkom evaluacije bolje ovako
            setTimeout(kickEval,room,localData,io,4000)
        }
        
   }else{
       //nista se ne desi 
   }
}

function voteKickCounter(room,username,mode,locaData,socket,io){
    if(room in localData){
        if('kickVote' in locaData[room]){
            
            if(!localData[room]['kickVote']['alreadyVoted'].includes(username))
            {
                localData[room]['kickVote']['alreadyVoted'].push(username)
                if(mode == "FOR"){
                    localData[room]['kickVote']['for'] += 1
                }
                localData[room]['kickVote']['totalVotes'] +=1
                
                socket.emit("voteKickCounterResponse",{ "Success" : true,
                            "MSG": "Uspešno glasanje!"
                    })
                if(((localData[room]['kickVote']['for'] / localData[room]['playerCount']) *100 ) > 50){
                    kickEval(room,localData,io)
                    clearTimeout(localData[room]['kickVote']['timeoutID'])
                }else if(locaData[room]['totalVotes'] == localData[room]['playerCount']){
                    io.to(room).emit('kickResult',{'Success':false,
                        "ERR_MSG":"Glasanje završeno , nedovoljno glasova za izbacivanje!" 
                    })
                    clearTimeout(localData[room]['kickVote']['timeoutID'])
                    delete localData[room]['kickVote']
                }
            }
            else
            socket.emit("voteKickCounterResponse",{"Success":false,
                "ERR_MSG": "Moguće je glasati samo jednom!"        
            })             
        }else{
            socket.emit("voteKickCounterResponse",{"Success":false,
                    "ERR_MSG":"Glasanje nije u toku"
                
            }) 
        }
    }else
        socket.emit("roomNotExist","Soba više ne postoji, kreirajte novu!");
}
function predlagac(predlog,slovo,kategorija){
   
    pool.query(`insert into predlozi values(DEFAULT,?,?,${kategorija});`,[predlog,slovo],(err,results,fields)=>{
        if(err){
            console.log(`Doslo je do problema u toku unosenja predloga : ERR : ${err.sqlMessage}\nCode : ${err.code} ` );
        }
        else
            console.log("Predlog dodat");
    });
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
    evaluation,
    predlagac,
    startVoteKick,
    voteKickCounter,
    historyReq
    
}