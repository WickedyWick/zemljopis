'''
converts cities.json to more readable format name : {
    countrycode,
    population
}
ako je key vec postoji ostavi najveci grad koristi openapi ovaj
!!!PREVISE SPORO!!! lose resenje
'''

import requests
from bs4 import BeautifulSoup
import time
import json
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

with open('cities.json','r',encoding='utf-8') as f:
    citiesJSON = json.load(f)

output = {}
for o in citiesJSON:
    if o['name'] in output:
        if(output[o['name']] != o['country']):
            res1 = get_city_opendata(o['name'],output[o['name']])
            time.sleep(3)
            res2 = get_city_opendata(o['name'],o['country'])
            time.sleep(3)
            print(o['name'])
            print(output[o['name']])
            if(res1 != None and res2 != None):
                if('population' in res1 and 'population' in res2):
                    if(res1['population'] < res2['population']):
                        output[o['name']] = o['country']
                elif('population' not in res1 and 'population' in res2):
                    output[o['name']] = o['country']            
    else:
        output[o['name']] = o['country']
    print(o['name'])

with open('./countryFormated.json','w',encoding='utf-8') as f:
    f.dump(output,f,ensure_ascii=False)