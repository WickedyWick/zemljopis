'''
Categories 
0: Drzava
1: Grad
2: Reka
3: Jezero
4: More
5: Planina
6: Biljka
7: Zivotinja
8: Imena
9: Sport
10: Klubovi?
11: ???
12: ??
13: Serije??
'''
import csv
letters = {'š':'s','ć':'c','č':'c','đ':'dj','ž':'z'}
def translator(word):
    new = ''
    for l in word:
        try:
            new += letters[l]
        except(KeyError):
            new += l
    return new

lastCorrect = ''
lastCLetter =''
#promeni kategoriju u l38 u zavistosti sta hoces da extractujes

with open('E:/Nacional secret/Zemljopis/db/category_answers_table.csv',encoding='utf-8') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter='|')
    line_count = 0
   
    with open('../drzave/newData.txt','a',encoding='utf-8') as f:
        for row in csv_reader:
            if(row[0] == '0'):
                if(lastCorrect == ''):
                    lastCorrect = row[1]
                    lastCorrectLetter = row[2]
                    
                else:
                    if(row[1] == translator(lastCorrect)):                        
                        f.write(f'{lastCorrect}|{row[1]}|{lastCorrectLetter}\n')
                        lastCorrect = ''
                        lastCorrect = ''
                    else:                       
                        f.write(f'{lastCorrect}|{lastCLetter}\n')
                        lastCorrect = row[1]
                        lastCLetter = row[2]

                    



    