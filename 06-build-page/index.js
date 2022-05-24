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

let _pathOriginalDirectory =path.join(__dirname, 'assets');
let _pathCopyDirectory =path.join(__dirname, 'project-dist', 'assets');


async function handlingDirectory() {
  await fs.promises.rm(_pathCopyDirectory, { recursive: true, force: true }, (err) => {
    if (err) console.error(err);
  });

  await fs.promises.mkdir(_pathCopyDirectory, { recursive: true }, (err) => {
    if (err) console.error(err);
  });

  (async function copyDirectory (pathOriginal = _pathOriginalDirectory, pathCopy = _pathCopyDirectory) {
 
    const files = await fs.promises.readdir(pathOriginal, { withFileTypes: true }, (err) => {
      if (err) console.error(err);
    });
  
    files.forEach(async file => {

      if (file.isFile()) {
        let file_name = path.parse(file.name).base;
        let file_original = path.join(pathOriginal, file_name);
        let file_copy = path.join(pathCopy, file_name);
        await fs.promises.copyFile(file_original, file_copy);
      }else{
        fs.promises.mkdir(path.join(pathCopy, file.name), { recursive: true }, (err) => {
          if (err) console.error(err);
        });
        copyDirectory (path.join(pathOriginal, file.name), path.join(pathCopy, file.name));
      }
    });
    console.log('Файлы скопированы в папку.');
  }());
}

handlingDirectory();

let buff = '';
reader.on('data', (chunk) => buff += chunk.toString());
reader.on('end', () => console.log(buff));
