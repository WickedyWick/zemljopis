#importuje u predloge
import mysql.connector
mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="",
  database="zemljopisv2"
)

mycursor = mydb.cursor()
lines = []
with open("final.txt","r",encoding="UTF-8") as f:
    lines = f.readlines()
    for l in lines:
      splitted = l.split('|')
      original = splitted[0]
      kat = splitted[len(splitted) - 1]
      letter = splitted[len(splitted)- 2]
      val = (original,letter,kat)
      mycursor.execute(f'insert into originaldata values(DEFAULT,%s,%s,%s)',val)
      lastID = mycursor.lastrowid
      vals = []
      for i in range(0,len(splitted)-2):
        vals.append((splitted[i],letter,kat,lastID))
      mycursor.executemany('insert into referencedata values(DEFAULT,%s,%s,%s,%s)',vals)
mydb.commit()