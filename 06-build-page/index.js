const fs = require('fs');
const path = require('path');
let readerTemplateStream = fs.createReadStream(path.join(__dirname, 'template.html'));

let _pathProjectDist = path.join(__dirname, 'project-dist');
fs.promises.mkdir(_pathProjectDist, { recursive: true }, (err) => {
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
      readableStream.on('data', data => writeableStream.write(data.toString()+'\n'));
      //readableStream.pipe(writeableStream);
    }
  });
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
  }());
}

handlingDirectory();

async function componentsTemplates() {
  let result = {};
  let pathComponents = path.join(__dirname, 'components');
  const components = await fs.promises.readdir( pathComponents, { withFileTypes: true }, (err) => {
    if (err) console.error(err);
  });
  for (let file of components) {
    let file_path = path.join( pathComponents, file.name);
    let file_name = path.parse(file.name).name;
    if (file.isFile() && path.parse(file.name).ext === '.html') {
      let dataHtmlComponent = await fs.promises.readFile(file_path);
      result[file_name] = dataHtmlComponent.toString();
    }
  }
  return result;
}

(async function () {
  const writeableTemplateStream = fs.createWriteStream(path.join(_pathProjectDist, 'index.html'));
  const objComponents = await componentsTemplates();
  let strTemplates = '';
  readerTemplateStream.on('data', (chunk) => strTemplates += chunk.toString()).on('end', () => {
    for (let component of Object.keys(objComponents)) {
      strTemplates = strTemplates.replace(`{{${component}}}`, objComponents[component]);
    }
    writeableTemplateStream.write(strTemplates);
  });   
}());

