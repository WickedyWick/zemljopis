from decouple import config
import requests
import json
print("********* StatsViewer by Aleksa Crveni *********")
def printer():
    print("1. Get total number of registered players")
    print("2. Get number of registered players on certain date")
    print("3. Get number of registered players between 2 dates(inclusive)")
    print("4. Get total number of created rooms")
    print("5. Get number of created rooms on certain date")
    print("6. Get number of created rooms between 2 dates (inclusive)")
    print("7. Get total number of rounds played")
    print("8. Get number of rounds played on certain date")
    print("9. Get number of rounds played between 2 dates (inclusive)")
    print("0. Izlaz")
printer()
opcija = input("\n Choose option...")
while(True):
    if(opcija =="1"):
        r = requests.get(f'http://46.40.27.131:3000/admin/{config("ADMIN_TOKEN")}/player')
        if (r.status_code == 500):
            print("ERROR")
        elif(r.status_code == 200):
            res = json.loads(r.text)
            print(res['Count'])
        printer()
        opcija = input("\nChoose option...")
    elif(opcija =="2"):
        date = input("\nInsert date in YYYY-MM-DD format..")
        r = requests.get(f'http://46.40.27.131:3000/admin/{config("ADMIN_TOKEN")}/player/{date}')
        if (r.status_code == 500):
            print("ERROR")
        elif(r.status_code == 200):
            res = json.loads(r.text)
            print(res['Count'])
        printer()
        opcija = input("\n Choose option...")
    elif(opcija == "3"):
        date = input("\nInsert starting date in YYYY-MM-DD format..")
        date2 = input("\nInsert ending date in YYYY-MM-DD format..")
        r = requests.get(f'http://46.40.27.131:3000/admin/{config("ADMIN_TOKEN")}/player/{date}/{date2}')
        if (r.status_code == 500):
            print("ERROR")
        elif(r.status_code == 200):
            res = json.loads(r.text)
            print(res['Count'])
        printer()
        opcija = input("\n Choose option...")
    elif(opcija =="4"):
        r = requests.get(f'http://46.40.27.131:3000/admin/{config("ADMIN_TOKEN")}/room')
        if (r.status_code == 500):
            print("ERROR")
        elif(r.status_code == 200):
            res = json.loads(r.text)
            print(res['Count'])
        printer()
        opcija = input("\nChoose option...")
    elif(opcija =="5"):
        date = input("\nInsert date in YYYY-MM-DD format..")
        r = requests.get(f'http://46.40.27.131:3000/admin/{config("ADMIN_TOKEN")}/room/{date}')
        if (r.status_code == 500):
            print("ERROR")
        elif(r.status_code == 200):
            res = json.loads(r.text)
            print(res['Count'])
        printer()
        opcija = input("\n Choose option...")
    elif(opcija == "6"):
        date = input("\nInsert starting date in YYYY-MM-DD format..")
        date2 = input("\nInsert ending date in YYYY-MM-DD format..")
        r = requests.get(f'http://46.40.27.131:3000/admin/{config("ADMIN_TOKEN")}/room/{date}/{date2}')
        if (r.status_code == 500):
            print("ERROR")
        elif(r.status_code == 200):
            res = json.loads(r.text)
            print(res['Count'])
        printer()
        opcija = input("\n Choose option...")
    elif(opcija =="7"):
        r = requests.get(f'http://46.40.27.131:3000/admin/{config("ADMIN_TOKEN")}/round')
        if (r.status_code == 500):
            print("ERROR")
        elif(r.status_code == 200):
            res = json.loads(r.text)
            print(res['Count'])
        printer()
        opcija = input("\nChoose option...")
    elif(opcija =="8"):
        date = input("\nInsert date in YYYY-MM-DD format..")
        r = requests.get(f'http://46.40.27.131:3000/admin/{config("ADMIN_TOKEN")}/round/{date}')
        if (r.status_code == 500):
            print("ERROR")
        elif(r.status_code == 200):
            res = json.loads(r.text)
            print(res['Count'])
        printer()
        opcija = input("\n Choose option...")
    elif(opcija == "9"):
        date = input("\nInsert starting date in YYYY-MM-DD format..")
        date2 = input("\nInsert ending date in YYYY-MM-DD format..")
        r = requests.get(f'http://46.40.27.131:3000/admin/{config("ADMIN_TOKEN")}/round/{date}/{date2}')
        if (r.status_code == 500):
            print("ERROR")
        elif(r.status_code == 200):
            res = json.loads(r.text)
            print(res['Count'])
        printer()
        opcija = input("\n Choose option...")
    elif(opcija == "0"):
        exit()
    else:
        printer()
        opcija = input("\n Nepostojeca opcija, izaberite drugu...")
        
    
print(r.text)