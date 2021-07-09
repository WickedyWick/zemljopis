import mysql.connector
import sys
import os.path
from datetime import date
import re


mydb = mysql.connector.connect(
  host="localhost",
  user="root",
  password="",
  database="zemljopisv2"
)
mycursor = mydb.cursor()
result = []
if(len(sys.argv) == 2):
    if(sys.argv[1] ==  "TODAY"):
        today = date.today()
        date = today.strftime("%Y/%m/%d 00:00:00")
        mycursor.execute("select * from predlozi where dateTimeCreated > '%s' and dateTimeCreated < NOW();",date)
        result = mycursor.fetchall()
        with open("data.txt","w",encoding="UTF-8") as f:
            for x in result:
                f.write(f"{x[1]}|{x[2]}|{x[3]}\n")
    else:
        print("Invalid arguments")
elif(len(sys.argv) == 3):
    if(sys.argv[2] == "TODAY"):
        date = sys.argv[1] + " 00:00:00"
        mycursor.execute("select * from predlozi where dateTimeCreated > '%s' and dateTimeCreated < NOW();",date)
        result = mycursor.fetchall()
        with open("data.txt","w",encoding="UTF-8") as f:
            for x in result:
                f.write(f"{x[1]}|{x[2]}|{x[3]}\n")
    else:
        date1 = sys.argv[1] + " 00:00:00"
        date2 = sys.argv[2] + " 00:00:00"
        vals = (date1,date2)
        mycursor.execute("select * from predlozi where dateTimeCreated > \"%s\" and dateTimeCreated < \"%s\" ;",vals)
        result = mycursor.fetchall()
        with open("data.txt","w",encoding="UTF-8") as f:
            for x in result:
                f.write(f"{x[1]}|{x[2]}|{x[3]}\n")
else:
    print("Invalid arguments")
        




    
