const mysql = require('mysql')
const perf = require('perf_hooks')

var pool = require('W:\\TTM\\public\\javascripts\\trueMysql.js')


// vidi da kesiras podatke

//PROCITAJOVOVOVOVOVOVOVOVOOVO!!!! Stavi playerID u otherDict i onda samo prodjes i saberes sve poene i posaljes u bazu za svakog playera
t0 = perf.performance.now()
function test(){
    return new Promise((resolve,reject)=>{
    
    localData = {
        'playerCount' : 8,
        'playersReady' : 0,
        'roundNumber' : 1,
        'roundTimeLimit': Number(60),
        'roundActive' : false,
        'roundID': null,
        'players' : {1:"Test1",2:"Test2",3:"Test3",4:"Test4",5:"Test5",6:"Test6",7:"Test7",8:"Test8"},
        'playersID' : {"Test1":1,"Test2":2,"Test3":3,"Test4":4,"Test5":5,"Test6":6,"Test7":7,"Test8":8},
        'intervalObj' : null,
        'availableLetters':["a","b","c","č","ć","d","dž","đ","e","f","g","h","i","j","k","l","lj","m","n","nj","o","p","r","s","š","t","u","v","z","ž"],
        'currentLetter': 'a',
        'data': {1 :['alzir','alzir','aleksa','aronija','anakonda','arbanaška planina','amazon','avion'],
        2 :['austrija','apatin','aleksandra','artičoka','anakonda','avala','arnauta','avion'],
        3 :['australija','arilje','aleksandar','artičoka','amurski spavač','avala','arnauta','avion'],
        4 :['alžir','ada','aleksej','albicija','amurski čebačok','arbanaška planina','amazon','avion'],
        5 :['andora','aleksinac','anastasija','aronija','amurski spavač','arbanaška planina','amazon','avion'],
        6 :['argentina','adorjan','aleksa','albicija','amurski čebačok','','amazon','avion'],
        7 :['avganistan','ada','aki','ananas','amurski čebačok','avala','amazon','avion'],
        8 :['andora','aleksandrovo','ana','aronija','amurski spavačada','avala','amazon','avion']}
        
    }

    /* dict structure  name : {
        kategorija : {
            count : x
            playersID : []
        }
        : [], jer moze da ima vise kateogrija isto , count mora biti povezan sa kategorijom
        playerIds = [ ]
    }
    */
    pool.getConnection((err,connection)=>{
        dataKeys = Object.keys(localData['data'])
        myDict = {  }
        ids = {}
        sql = "select naziv , kategorija ,oDataID from referencedata where slovo ='a' and (naziv" 
        for(let i =0;i < dataKeys.length;i++){
            dataRow = localData['data'][dataKeys[i]];
            for(let j=0;j<dataRow.length;j++){
                nazivPodatka = dataRow[j]
                if(nazivPodatka in myDict && nazivPodatka != ''){
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
        console.log(myDict)
        naziviKeys = Object.keys(myDict)
        otherDict = {}
        connection.query(sql,naziviKeys,(err,results,fields)=>{
                
                
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
            
            if(err)
                console.log(err)
            else{
                for(let i =0;i<results.length;i++){
                    oDataID = results[i]['oDataID']
                    kategorija = results[i]['kategorija']
                   
                
                    naziv = results[i]['naziv']
                    
                    if(naziv in myDict && kategorija in myDict[naziv]){
                        console.log(myDict[naziv][kategorija]['ids'])
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
                                    ids[myDict[naziv][kategorija]['ids'][j]] += 10
                            otherDict[oDataID]['points'] = 10
                        }
                        //dodavaj nazive u 
                        }
                    }
                }
                console.log(otherDict)
                pointsDict = {}
                otherDictKeys = Object.keys(otherDict)
                /*kategroija{
                    naziv : poeni
                }
                */
                for(let i =0;i<otherDictKeys.length;i++){
                    nazivi = otherDict[otherDictKeys[i]]['nazivi']
                    kategorija = otherDict[otherDictKeys[i]]['kategorija']
                    poeni = otherDict[otherDictKeys[i]]['points']
                    if(!(kategorija in pointsDict))
                        pointsDict[kategorija] = {}
                    for(let j =0;j<nazivi.length;j++)
                        pointsDict[kategorija][nazivi[j]] = poeni
                }
                console.log(ids)
                t1 =perf.performance.now()
                resolve(pointsDict)
                reject('test')                
                
               
               
            }
        })
        connection.release();
    })
    })
}

test()
/*
for(let x = 0;x<10000;x++){test().then((response)=>{
    console.log(`Time : ${perf.performance.now() - t0}`)
    console.log(`Memory : ${process.memoryUsage().heapUsed / 1024 / 1024}`)
},reject=>{
    console.log('FAIL')
 })
}

*/
