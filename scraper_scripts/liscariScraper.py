import pip._vendor.requests as requests
from bs4 import BeautifulSoup

webUrl = requests.get("https://rasadniksmaragd.com/proizvodi/liscari/").text

soup = BeautifulSoup(webUrl,features="html.parser")

myDivs = soup.findAll('div',{'class':'plant'})

with open('data/liscari.txt','w',encoding='utf-8') as f:
    for d in myDivs:
        div = d.find('div',{'class':'title'})
        a = div.find('a')
        try:
            f.write(a.get('title')+"\n")
        except(AttributeError):
            pass
            
        

