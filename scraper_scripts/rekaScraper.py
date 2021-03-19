# -*- coding: utf-8 -*-
import requests
from bs4 import BeautifulSoup

webUrl = requests.get("https://sr.wikipedia.org/sr-el/Списак_река_у_Србији").text
soup = BeautifulSoup(webUrl,features="html.parser")

myTable = soup.find('table',{'class':'sortable wikitable'})
rows = myTable.findAll('tr')[1:]
myTables = soup.findAll('table')
allUnorderedLists = soup.findAll('ul')
with open('data/reke.txt','w',encoding='utf-8') as f:
    for row in rows:
        columns = row.findAll('td')
        a = columns[1].find('a')
        f.write(a.get('title')+'\n')
    unorderedLists = myTables[2].findAll('ul')
    for u in unorderedLists:
        lists = u.findAll('li')
        for l in lists:         
            a = l.find('a')
            f.write(a.get('title')+'\n')
    lists = allUnorderedLists[len(allUnorderedLists)-19].findAll('li')
    
    for l in lists:
        a = l.find('a')
        f.write(a.get('title')+'\n')
    

