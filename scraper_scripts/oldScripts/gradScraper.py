#data.txt + cities.json koristi
import pip._vendor.requests as requests
from bs4 import BeautifulSoup

webUrl = requests.get("https://sr.wikipedia.org/sr-el/Списак_главних_градова_по_државама").text

soup = BeautifulSoup(webUrl,features="html.parser")

myTable = soup.find('table',{'class':'wikitable sortable'})
tbody = myTable.find('tbody')
rows = myTable.findAll('tr')


with open('data/grad.txt','w',encoding='utf-8') as f:
    for row in rows :
        columns = row.findAll('td')
        try:
            a = columns[0].find('a')
            f.write(a.get('title')+"\n")
        except(IndexError):
            pass    
         
            
        

