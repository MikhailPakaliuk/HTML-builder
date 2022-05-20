const fs = require('fs');
const path = require('path');
let reader = fs.createReadStream(path.join(__dirname, 'text.txt'));

reader.on('data', (chunk) => console.log(chunk.toString()));