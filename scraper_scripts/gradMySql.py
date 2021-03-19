import mysql.connector
import json

mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="",
  database="zemljopis"
)
mycursor = mydb.cursor()
data = []
sqlList = []

with open("srpskiGradoviB1000.json",'r',encoding='utf-8') as f :
    data = json.load(f)
for d in data:
    temp = d['name']
    sqlList.append((temp,temp[:1].lower()))

sql = "INSERT INTO grad (naziv, slovo) VALUES (%s, %s)"

mycursor.executemany(sql, sqlList)

mydb.commit()