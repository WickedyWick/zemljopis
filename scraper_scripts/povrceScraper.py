import pip._vendor.requests as requests
from bs4 import BeautifulSoup

webUrl = requests.get("https://www.agroklub.rs/sortna-lista/povrce/").text

soup = BeautifulSoup(webUrl,features="html.parser")

mySpans = soup.findAll('span',{'class':'card card-text card-text-main'})


with open('data/povrce.txt','w',encoding='utf-8') as f:
    for s in mySpans:
        img = s.find('img')
        try:
            f.write(img.get('title')+"\n")
        except(AttributeError):
            pass

webUrl = requests.get('https://www.agroklub.rs/sortna-lista/zitarice/').text

soup = BeautifulSoup(webUrl,features="html.parser")

mySpans = soup.findAll('span',{'class':'card card-text card-text-main'})

with open('data/povrce.txt','a',encoding='utf-8') as f:
    for s in mySpans:
        img = s.find('img')
        try:
            f.write(img.get('title')+"\n")
        except(AttributeError):
            pass

webUrl = requests.get('https://www.agroklub.rs/sortna-lista/krmno-bilje/').text
soup = BeautifulSoup(webUrl,features="html.parser")

mySpans = soup.findAll('span',{'class':'card card-text card-text-main'})
with open('data/povrce.txt','a',encoding='utf-8') as f:
    for s in mySpans:
        img = s.find('img')
        try:
            f.write(img.get('title')+"\n")
        except(AttributeError):
            pass

webUrl = requests.get('https://www.agroklub.rs/sortna-lista/lekovito-bilje/').text
soup = BeautifulSoup(webUrl,features="html.parser")

mySpans = soup.findAll('span',{'class':'card card-text card-text-main'})
with open('data/povrce.txt','a',encoding='utf-8') as f:
    for s in mySpans:
        img = s.find('img')
        try:
            f.write(img.get('title')+"\n")
        except(AttributeError):
            pass

webUrl = requests.get('https://www.agroklub.rs/sortna-lista/repa-krompir/').text
soup = BeautifulSoup(webUrl,features="html.parser")

mySpans = soup.findAll('span',{'class':'card card-text card-text-main'})
with open('data/povrce.txt','a',encoding='utf-8') as f:
    for s in mySpans:
        img = s.find('img')
        try:
            f.write(img.get('title')+"\n")
        except(AttributeError):
            pass

webUrl = requests.get('https://www.agroklub.rs/sortna-lista/uljarice-predivo-bilje/').text
soup = BeautifulSoup(webUrl,features="html.parser")

mySpans = soup.findAll('span',{'class':'card card-text card-text-main'})
with open('data/povrce.txt','a',encoding='utf-8') as f:
    for s in mySpans:
        img = s.find('img')
        try:
            f.write(img.get('title')+"\n")
        except(AttributeError):
            pass

webUrl = requests.get('https://www.agroklub.rs/sortna-lista/voce/').text
soup = BeautifulSoup(webUrl,features="html.parser")

mySpans = soup.findAll('span',{'class':'card card-text card-text-main'})
with open('data/povrce.txt','a',encoding='utf-8') as f:
    for s in mySpans:
        img = s.find('img')
        try:
            f.write(img.get('title')+"\n")
        except(AttributeError):
            pass





        

