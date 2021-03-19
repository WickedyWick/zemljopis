import pip._vendor.requests as requests
from bs4 import BeautifulSoup

webUrl = requests.get("https://sr.wikipedia.org/sr-el/Списак_воћа").text

soup = BeautifulSoup(webUrl,features="html.parser")

myDiv = soup.find('div',{'class':'div-col'})
links = myDiv.findAll('li')

with open('data/voca.txt','w',encoding='utf-8') as f:
    for l in links:
        a = l.find('a')
        try:
            f.write(a.get('title')+"\n")
        except(AttributeError):
            pass
            
        

