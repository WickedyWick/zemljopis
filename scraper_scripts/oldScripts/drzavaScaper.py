import pip._vendor.requests as requests
from bs4 import BeautifulSoup

webUrl = requests.get("https://sr.wikipedia.org/sr-el/Списак_суверених_држава").text

soup = BeautifulSoup(webUrl,features="html.parser")

myTable = soup.find('table',{'class':'sortable wikitable'})
rows = myTable.findAll('tr')[3:]

with open('../drzave/drzava.txt','w',encoding='utf-8') as f:
    for row in rows :
        columns = row.findAll('td')
        a = columns[1].find('a')
        try:
            f.write(a.get('title')+"\n")
        except(AttributeError):
            pass
            
        

