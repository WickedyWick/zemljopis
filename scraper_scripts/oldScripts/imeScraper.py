import pip._vendor.requests as requests
from bs4 import BeautifulSoup

webUrl = requests.get("https://sr.wikipedia.org/sr-ec/Списак_српских_имена").text

soup = BeautifulSoup(webUrl,features="html.parser")

myTables = soup.findAll('table',{'rules':'all'})


with open('data/imena.txt','w',encoding='utf-8') as f:
    for table in myTables:
        rows = table.findAll('tr')
        for row in rows:
            columns = row.findAll('td')
            if(len(columns)>0):
                a = columns[0].find('a')
                data = a.get('title')
                ime = data.split(' ')[:1]
                try:
                    f.write(ime[0   ] +"\n")
                except(AttributeError):
                    pass
          
        

