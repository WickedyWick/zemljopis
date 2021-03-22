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
import sys
import os.path
categoryDict ={'drzava':1,'grad':0,'ime':2,'biljka':3,'zivotinja':4,'planina':5,'reka':6,'predmet':7}
mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="",
  database="zemljopis"
)
mycursor = mydb.cursor()
countries = []
sqlList = []
if(len(sys.argv) == 3):
    try:
        path = sys.argv[1]
        cat = sys.argv[2]
        with open(path,'r',encoding='utf-8') as f :
            lines = f.readlines()
        for l in lines:
            splited = l.strip().split('|')
            original = splited[0]
            letter = splited[len(splited)-1].lower()
            val = (original,letter,categoryDict[cat])
            mycursor.execute(f'insert into originaldata values(DEFAULT,%s,%s,%s)',val)
            lastID = mycursor.lastrowid
            vals = []
            for i in range(0,len(splited)-1):
                vals.append((splited[i],letter,categoryDict[cat],lastID))
            mycursor.executemany('insert into referencedata values(DEFAULT,%s,%s,%s,%s)',vals)
    except:
        print("ERROR")



    mydb.commit()
else:
    print('Invalid arguments\n <FullFilePath> <Category>')