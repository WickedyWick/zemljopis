import pip._vendor.requests as requests
from bs4 import BeautifulSoup

fieldList = ['gradovi','planine','reke','zivotinje','biljke','predmeti']
for f in fieldList :
    webUrl = requests.get("http://zanimljivageografija.net/gradovi.html").text

    soup = BeautifulSoup(webUrl,features="html.parser")

    myDiv = soup.find('div',{'class':'feature1'})
    uls = myDiv.findAll('ul')

    with open('data/voca.txt','w',encoding='utf-8') as f:
        for ul in uls:
            lis = ul.findAll('li')
            for l in lis :                
                print(str(l)[4::4])
            
        

