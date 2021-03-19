import mysql.connector

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="",
  database="zemljopis"
)
mycursor = mydb.cursor()
reke = []
sqlList = []
with open("data/reke.txt",'r',encoding='utf-8') as f :
    reke = f.readlines()
for c in reke:
    temp = c.rstrip()
    sqlList.append((temp,temp[:1].lower()))

sql = "INSERT INTO reka (naziv, slovo) VALUES (%s, %s)"

mycursor.executemany(sql, sqlList)

mydb.commit()