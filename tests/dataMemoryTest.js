let array = new Array(1e9).fill('ASKHDCJOWHECQWOEHCQWIOECHKLshdkljasdjqwcio')

const used = process.memoryUsage().heapUsed / 1024 / 1024;
console.log(`The script uses approximately ${used} MB`);