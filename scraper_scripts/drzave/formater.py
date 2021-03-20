#formatira podatke iz data.txt u format koji meni odgovara
with open('./drzava.txt','r',encoding='utf-8') as f:
    lines = f.readlines()

letterDict = {"č":"c","ć":"c","ž":"z","đ":"dj",'š':"s"}

with open('./newData.txt','w',encoding='utf-8') as f:
    for l in lines :
        stripped = l.strip().lower()
        deobfuscated = ''
        letter = stripped[0]
        for c in stripped:
            try:
                deobfuscated += letterDict[c]
            except(KeyError):
                deobfuscated +=c
        if(deobfuscated != stripped):
            f.write(f'{stripped}|{deobfuscated}|{letter}\n')
        else:
            f.write(f'{stripped}|{letter}\n')
