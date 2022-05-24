const fs = require('fs');
const path = require('path');
let reader = fs.createReadStream(path.join(__dirname, 'template.html'));

fs.promises.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
    if (err) console.error(err);
});

(async function () {
    const files = await fs.promises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }, (err) => {
        if (err) console.error(err);
    });
    const writeableStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'style.css'));
    files.forEach(async file => {
        if (file.isFile() && path.parse(file.name).ext === '.css') {
            let file_name = path.parse(file.name).base;
            let readableStream = fs.createReadStream(path.join(__dirname, 'styles', file_name));
            readableStream.pipe(writeableStream);
        }
    });
    console.log('Файл .css собран');
}());

//reader.on('data', (chunk) => console.log(chunk.toString()));