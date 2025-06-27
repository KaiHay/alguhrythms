import * as fs from 'fs';
const file = fs.readFileSync('src/app/_components/input.txt', 'utf8');
const hi = file.split('\n')
const group = []
for (const i of hi) {
    const units = i.split(/\s+/)
    group.push(units)
}
let right=0
let left = 0
for (let i = 0;  i< group.length; i++){
    console.log(i)
    left += parseInt(group[i]![0]!) 
    right += parseInt(group[i]![1]!)
    
}
console.log(Math.abs(left-right));
