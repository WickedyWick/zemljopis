'''
comparing all cities from newData 
those who have over 500 population go into probation others are deleteed from newData
'''
import json
import re
with open('./newDataORIG.txt','r',encoding='UTF-8') as f:
    newDataLines = f.readlines()

with open('./gradoviSrbija.json','r',encoding='UTF-8') as f:
    gradoviJSON = json.load(f)
letterDict = {"č":"c","ć":"c","ž":"z","đ":"dj",'š':"s"}
index =0
with open('./newData2.txt','w',encoding='UTF-8') as newData2:
    with open('./tbcS.txt','w',encoding='UTF-8') as f:
        for l in newDataLines:
            if(index > 1901):
                try:
                   
                    stripped = l.strip()
                    

                    splited = stripped.split('|')
                    name = splited[0]
                    noSpaceName = re.sub(' ','',name)
                    letter = splited[len(splited)-1]
                    oNaziv = gradoviJSON[noSpaceName]['originalNaziv']
                    
                    if(int(gradoviJSON[noSpaceName]['brojStanovnika']) >= 500):
                        if ' ' in oNaziv:
                            changed = False
                            deobusfacated = ''
                            for c in oNaziv.lower() :
                                try:
                                    deobusfacated += letterDict[c]
                                    changed = True
                                except:
                                    deobusfacated += c
                            if(changed):
                                f.write(f'{oNaziv.lower()}|{deobusfacated}|{letter}\n')
                            else:
                                f.write(f'{oNaziv.lower()}|{letter}\n')
                        else :
                            f.write(f'{stripped}\n')
                        #f.write(f'{stripped}\n')                     
                except(KeyError):                    
                    newData2.write(f'{l.strip()}\n')
            index +=1
            
                

