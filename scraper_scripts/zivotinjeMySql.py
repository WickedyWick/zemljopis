import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="",
  database="zemljopis"
)
mycursor = mydb.cursor()
biljke = []
sqlList = []
with open("data/ribe.txt",'r',encoding='utf-8') as f :
    countries = f.readlines()
for c in countries:
    temp = c.rstrip()
    sqlList.append((temp,temp[:1].lower()))

sql = "INSERT INTO zivotinja (naziv, slovo) VALUES (%s, %s)"

mycursor.executemany(sql, sqlList)

mydb.commit()

