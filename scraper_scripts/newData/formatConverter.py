'''
Konvertujes nazivGrdavoaBIHRS.json u json gde je key naziv grada 
'''
import json
import re
import requests
import time
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

with open('./nazivGradovaBIHRS.json','r',encoding='UTF-8') as f:
    nazivJSON = json.load(f)

output = {}

letterDict = {"č":"c","ć":"c","ž":"z","đ":"dj",'š':"s"}
for o in nazivJSON:
    name = o['name']
    obfuscated = o['name'].lower()
    res = get_city_opendata(f'{name}','ba')
    obfuscatedNoSpace = re.sub(' ','',obfuscated)
    print(res)
    if(res == None):
        pass
    else:
        try:
            if(res['population'] > -1):   
                
                output[obfuscatedNoSpace] ={}
                output[obfuscatedNoSpace]['brojStanovnika'] = res['population']
                output[obfuscatedNoSpace]['originalNaziv'] = name
        except(KeyError):
            pass
    print(o['name'])
    time.sleep(5)

with open('./gradoviBIHRS.json','w',encoding='utf-8') as f:
    json.dump(output,f,ensure_ascii=False)
            