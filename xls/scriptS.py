import xlrd
import re
import json
book = xlrd.open_workbook("stanPoNaseljima2011Srbija.xls")
print("The number of worksheets is {0}".format(book.nsheets))

print("Worksheet name(s): {0}".format(book.sheet_names()))

sh = book.sheet_by_index(0)

print("{0} {1} {2}".format(sh.name, sh.nrows, sh.ncols))

output = {}
errorOutput = {}
'''print("Cell D30 is {0}".format(sh.cell_value(rowx=29, colx=3)))
for rx in range(sh.nrows):
    print(sh.row(rx))
'''
num = 0 
for rx in range(5,sh.nrows):
    naziv = str(sh.cell_value(rowx=rx, colx = sh.ncols-1))
    if(naziv != '' and naziv != ' '):
        test = naziv.rstrip()
        if(test[len(test)-1] == 'u' and test[len(test)-2] == ' '):        
            test2 = test[:len(test)-1].rstrip()
        else:
            test2 = test.rstrip()
        nazivNoSpace = re.sub(' ','',test2).lower()
        brojStanovnika = sh.cell_value(rowx=rx, colx = 3)
        try:
            output[nazivNoSpace] = {}
            output[nazivNoSpace]['originalNaziv'] = test2
            output[nazivNoSpace]['brojStanovnika'] = int(float(brojStanovnika))
        except:
            errorOutput[nazivNoSpace] = brojStanovnika
        num +=1 
print(num)

with open('gradovi.json','w',encoding='UTF-8') as jsonFile:
    json.dump(output,jsonFile,ensure_ascii=False)

with open('error.json','w',encoding='UTF-8') as jsonFile:
    json.dump(errorOutput,jsonFile,ensure_ascii=False)

#Sada prodji kroz sve gradove is newData.txt i uporedi ako nadjes obrisi iz new data i upisi u datu u zavisnosti da li je vece ili manje od 500