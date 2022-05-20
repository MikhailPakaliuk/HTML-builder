const fs = require('fs');
const path = require('path');
const outputStream = fs.createWriteStream(path.join(__dirname, 'text.txt'));

let readline = require('readline');
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function handle() {
    rl.output.write('Заходи ещё\n');
    rl.close();
}

rl.output.write('Привет, напиши что-нибудь\n');
rl.on('line', (input) => {
    if (input === 'exit')
        return handle();
    outputStream.write(input);
}).on('SIGINT', handle);

process.on('SIGINT', handle);
