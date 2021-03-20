'''
Categories 
1: Drzava
0: Grad
2: Ime
3: Biljka
4: Zivotinja
5: Planina
6: Reka
7: Predmet
'''
#unosi podatke u mysql xD
import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="",
  database="zemljopis"
)
mycursor = mydb.cursor()
countries = []
sqlList = []

with open("./newData.txt",'r',encoding='utf-8') as f :
    lines = f.readlines()
for l in lines:
    splited = l.strip().split('|')
    original = splited[0]
    letter = splited[len(splited)-1].lower()
    val = (original,letter,1)
    mycursor.execute(f'insert into originaldata values(DEFAULT,%s,%s,%s)',val)
    lastID = mycursor.lastrowid
    vals = []
    for i in range(0,len(splited)-1):
        vals.append((splited[i],letter,1,lastID))
    mycursor.executemany('insert into referencedata values(DEFAULT,%s,%s,%s,%s)',vals)



mydb.commit()
