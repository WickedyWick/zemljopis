letterDict = {
    'A':'А',
    'B':'Б',
    'V':'В',
    'G':'Г',
    'D':'Д',
    'Đ':'Ђ',
    'E':'Е',
    'Ž':"Ж",
    'Z':'З',
    'I':'И',
    'J':'Ј',
    'K':'К',
    'L':'Л',
    'Lj':'Љ',
    'M':'М',
    'N':'Н',
    'Nj':'Њ',
    'O':'О',
    'P':'П',
    'R':'Р',
    'S':'С',
    'T':'Т',
    'Ć':'Ћ',
    'U':'У',
    'F':'Ф',
    'H':'Х',
    'C':'Ц',
    'Č':'Ч',
    'Dž':'Џ',
    'Š':'Ш',
    'a':'а',
    'b':'б',
    'v':'в',
    'g':'г',
    'd':'д',
    'đ':'ђ',
    'e':'е',
    'ž':'ж',
    'z':'з',
    'i':'и',
    'j':'ј',
    'k':'к',
    'l':'л',
    'lj':'љ',
    'm':'м',
    'n':'н',
    'nj':'њ',
    'o':'о',
    'p':'п',
    'r':'р',
    's':'с',
    't':'т',
    'ć':'ћ',
    'u':'у',
    'f':'ф',
    'h':'х',
    'c':'ц',
    'č':'ч',
    'dž':'џ',
    'š':'ш',
    ' ':' '
}

with open('../drzave/newData.txt','r',encoding='utf-8') as f:
    lines = f.readlines()

with open('../drzave/data.txt','w',encoding='utf-8') as f:
    for l in lines:
        splitted = l.strip().split('|')
        original = splitted[0]
        cirilica = ''
        letter =splitted[len(splitted)-1]      
        new = ''
        for i in range(0,len(splitted)-2):
            new += f'{splitted[i]}|'
        new += f'{letter}'
        f.write(f'{new}\n')
