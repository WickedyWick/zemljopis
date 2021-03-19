'''
comparing all cities from newData 
those who have over 500 population go into probation others are deleteed from newData
'''
import json
import re
with open('./newDataNEWEST.txt','r',encoding='UTF-8') as f:
    newDataLines = f.readlines()

with open('./gradoviBIHRS.json','r',encoding='UTF-8') as f:
    gradoviJSON = json.load(f)
letterDict = {"č":"c","ć":"c","ž":"z","đ":"dj",'š':"s"}
index =0
with open('./newData2.txt','w',encoding='UTF-8') as newData2:
    with open('./tbcBRS.txt','w',encoding='UTF-8') as f:
        for l in newDataLines:           
            try:                
                stripped = l.strip()           
                splited = stripped.split('|')
                name = splited[0]
                noSpaceName = re.sub(' ','',name)
                letter = splited[len(splited)-1]
                oNaziv = gradoviJSON[noSpaceName]['originalNaziv']
                try:
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
                except(ValueError):
                    pass
                    #f.write(f'{stripped}\n')                     
            except(KeyError):                    
                newData2.write(f'{l.strip()}\n')
           
            
                

