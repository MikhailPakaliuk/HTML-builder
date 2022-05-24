const fs = require('fs/promises');
const path = require('path');

(async function () {
  await fs.rm(path.join(__dirname, 'files-copy'), { recursive: true, force: true }, (err) => {
    if (err) console.error(err);
  });

  await fs.mkdir(path.join(__dirname, 'files-copy'), { recursive: true }, (err) => {
    if (err) console.error(err);
  });

  const files = await fs.readdir(path.join(__dirname, 'files'), { withFileTypes: true }, (err) => {
    if (err) console.error(err);
  });

  files.forEach(async file => {
    if (file.isFile()) {
      let file_name = path.parse(file.name).base;
      let file_original = path.join(__dirname, 'files', file_name);
      let file_copy = path.join(__dirname, 'files-copy', file_name);
      await fs.copyFile(file_original, file_copy);
    }
  });

  console.log('Файлы скопированы в files-copy.');
}());