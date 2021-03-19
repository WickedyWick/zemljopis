let dict = {}
for(let i=0;i<100000;i++){
    dict[i]={
        'playerCount' : 1,
        'playersReady' : 0,
        'roundNumber' : 1,
        'roundTimeLimit':120,
        'roundActive' :false,
        'intervalObj' : setTimeout(()=>s=1,0),
        'availableLetters':["a","b","c","č","ć","d","dž","đ","e","f","g","h","i","j","k","l","lj","m","n","nj","o","p","r","s","š","t","u","v","z","ž"],
        'currentLetter': 'a',
        'data': ['Aleskandrija','Aleskandrija','Aleskandrija','Aleskandrija','Aleskandrija','Aleskandrija','Aleskandrija']
    }
}

const used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`The script uses approximately ${used} MB`);

//100K values take up 34 MB