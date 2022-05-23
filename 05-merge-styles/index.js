const fs = require('fs');
const path = require('path');

(async function () {
    const files = await fs.promises.readdir(path.join(__dirname, 'styles'), { withFileTypes: true }, (err) => {
        if (err) console.error(err);
    });

    const writeableStream = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

    files.forEach(async file => {
        if (file.isFile() && path.parse(file.name).ext === '.css') {
            let file_name = path.parse(file.name).base;
            let readableStream = fs.createReadStream(path.join(__dirname, 'styles', file_name));
            readableStream.pipe(writeableStream);
        }
    });

    console.log('Файл собран в project-dist.');
}());