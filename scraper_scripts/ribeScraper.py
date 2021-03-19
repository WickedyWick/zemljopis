import pip._vendor.requests as requests
from bs4 import BeautifulSoup
'''
webUrl = requests.get("https://sr.wikipedia.org/sr-el/Списак_риба_Србије").text

soup = BeautifulSoup(webUrl,features="html.parser")

myTable = soup.find('table')

rows = myTable.findAll('tr')

with open('data/riba.txt','w',encoding='utf-8') as f:
    for r in rows:
        columns = r.findAll('td')
        if(len(columns) >0):
            try:
                f.write(str(columns[0])+'\n')
            except(AttributeError):
                pass
            
'''
webUrl = requests.get("https://sr.wikipedia.org/sr-el/Слатководне_рибе_у_Србији").text

soup = BeautifulSoup(webUrl,features="html.parser")

myTable = soup.find('div',{'class' : 'mw-parser-output'})

uls = myTable.findAll('ul')

with open('data/zivotinje.txt','a',encoding='utf-8') as f:
    for ul in uls:
        lis = ul.findAll('li')
        for li in lis :
            aas = li.findAll('a')
            try:
                f.write(aas[0].get('title')+'\n')
            except(TypeError):
                pass