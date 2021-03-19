import requests
import json
import time
import re

#izdvoji gradove koji su su iz bosne iz cities.json
def get_city_opendata(city, country):
    try:
        tmp = 'https://public.opendatasoft.com/api/records/1.0/search/?dataset=worldcitiespop&q=%s&sort=population&facet=country&refine.country=%s'
        cmd = tmp % (city, country)
        res = requests.get(cmd)
        dct = json.loads(res.content)
        out = dct['records'][0]['fields']
        return out
    except(IndexError):
        return None 
print(get_city_opendata('spionica%20srednja','ba'))

lines = []
with open ('./newDataNEWEST.txt','r',encoding='utf-8') as f:
    lines = f.readlines()

with open('./tbcB.txt','w',encoding='utf-8') as f:
    with open('./newData2.txt','w',encoding='utf-8') as newData2 :              
        for l in lines:
            time.sleep(5)
            mostCorrect = re.sub(' ','%20',l.strip())
            res = get_city_opendata(f'{mostCorrect}', 'ba')
            if(res != None):
                try:
                    if(res['population'] >500):
                        name = l.strip().lower()
                        if ' ' in name:
                            changed = False
                            deobusfacated = ''
                            for c in name :
                                try:
                                    deobusfacated += letterDict[c]
                                    changed = True
                                except:
                                    deobusfacated += c
                            if(changed):
                                f.write(f'{name}|{deobusfacated}|{letter}\n')
                            else:
                                f.write(f'{name}|{letter}\n')
                        else :
                            f.write(f'{l.strip()}\n')                  
                except(KeyError):
                    newData2.write(f'{l.strip()}\n')
