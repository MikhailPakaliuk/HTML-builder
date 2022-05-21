const fs = require('fs');
const path = require('path');

let readline = require('readline');
let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

fs.readdir(path.join(__dirname, 'secret-folder'), { withFileTypes: true }, (err, files) => {
  if (err)
  rl.output.write(err);
  else {
    files.forEach(file => {
        if (file.isFile()) {
            let file_url = path.join(__dirname, 'secret-folder', path.parse(file.name).base);
            let file_name = path.parse(file.name).name;
            let file_ext = path.parse(file.name).ext.replace(/[.]/g, '');
            fs.stat(file_url, generate_callback(file_url, file_name, file_ext));
        }
    });
    rl.close();
  }
});

function generate_callback(file, f_name,f_ext) {
    return function(err, stats) {
            let f_size =`${Math.ceil(stats["size"]/1024)}kb\n`;
            rl.output.write(`${f_name} - ${f_ext} - ${f_size}` );
        }
};