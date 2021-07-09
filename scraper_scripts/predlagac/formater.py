#formatira podatke iz data.txt u format koji meni odgovara
with open('./data.txt','r',encoding='utf-8') as f:
    lines = f.readlines()

letterDict = {"č":"c","ć":"c","ž":"z","đ":"dj",'š':"s"}

with open('./latSupp.txt','w',encoding='utf-8') as f:
    for l in lines :
        splitted = l.strip().lower().split('|')
        deobfuscated = ''
        kat = splitted[len(splitted)-1]
        letter = splitted[len(splitted)-2]
        main = splitted[0]                  
        for c in main:
            try:
                deobfuscated += letterDict[c]
            except(KeyError):
                deobfuscated +=c
        if(deobfuscated != main):
            f.write(f'{main}|{deobfuscated}|{letter}|{kat}\n')
        else:
            f.write(f'{main}|{letter}|{kat}\n')
    
