const e = require('express')
const mysql = require('mysql')
const perf = require('perf_hooks')
t0 = perf.performance.now()
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "zemljopis",
    multipleStatements: true
})

fieldKeys = ['drzava','grad','ime','biljka','zivotinja','planina','reka','predmet']
mysqlData = {'drzava':[],
            'grad':[],
            'ime':[],
            'biljka':[],
            'zivotinja':[],
            'planina':[],
            'reka':[],
            'predmet':[]

    }

    con.connect((err)=>{
        if(err){
            console.log("connection error")
        }else{

            
            con.query("select naziv from drzava where naziv like 'a%'; select naziv from grad where naziv like 'a%'; select naziv from ime where naziv like 'a%'; select naziv from biljka where naziv like 'a%'; select naziv from zivotinja where naziv like 'a%';select naziv from planina where naziv like 'a%';select naziv from reka where naziv like 'a%';select naziv from predmet where naziv like 'a%';",(err,results)=>{
                
                for(let i=0;i<results.length;i++){
                    results[i].forEach(element => mysqlData[fieldKeys[i]].push(element['naziv']))
                }
                
                let localData = {
                    'playerCount' : 2,
                    'playersReady' : 0,
                    'roundNumber' : 1,
                    'roundTimeLimit':Number(60),
                    'roundActive' :false,
                    'roundID': null,
                    'intervalObj' : null,
                    'availableLetters':["a","b","c","č","ć","d","dž","đ","e","f","g","h","i","j","k","l","lj","m","n","nj","o","p","r","s","š","t","u","v","z","ž"],
                    'currentLetter': '',
                    'players' : {1 : "Name"},
                    'data': {1 :['avganistan','aleksandrovo','aleksa','aronija','anakonda','arbanaška planina','amazon','avion'],
                            2 :['austrija','apatin','aleksandra','artičoka','anakonda','avala','arnauta','avion'],
                            3 :['australija','arilje','aleksandar','artičoka','amurski spavač','avala','arnauta','avion'],
                            4 :['adasdsa','ada','aleksej','albicija','amurski čebačok','arbanaška planina','amazon','avion'],
                            5 :['andora','aleksinac','anastasija','aronija','amurski spavač','arbanaška planina','amazon','avion'],
                            6 :['argentina','adorjan','aleksa','albicija','amurski čebačok','','amazon','avion'],
                            7 :['avganistan','ada','aki','ananas','amurski čebačok','avala','amazon','avion'],
                            8 :['andora','aleksandrovo','ana','aronija','amurski spavačada','avala','amazon','avion']
                        }
                }
                //1. uporedi sve i dodeli poene vrednostima
                playerIDKeys = Object.keys(localData['data'])
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
                    let temp = localData['data'][playerIDKeys[i]] // data niz
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
                
                for(let i=0;i<playerIDKeys.length;i++){
                    uPoints[localData[room][playerIDKeys[i]]] = points[playerIDKeys[i]]
                }
                
                console.log('end')
                process.exit()
            })
        }
        
        
    })

//ready for demo // treba da se doda specificno za igrace
//0.70 avg no load/single coreload
//0. avg 100% all cpu cores
