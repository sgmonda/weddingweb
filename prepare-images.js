const { getopt } = require('stdio');
const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');

const OPTIONS = getopt({
  source: { key: 'i', description: 'Folder where original images are', args: 1, mandatory: 1 },
  target: { key: 'o', description: 'Folder where processed images must go to', args: 1, mandatory: 1 },
});
const pathLarge = path.join(OPTIONS.target, '/', 'large');
const pathThumbnails = path.join(OPTIONS.target, '/', 'thumbnail');

const GET_COMMAND_THUMBNAIL = (name) => `convert -thumbnail '171x114^' -gravity center -extent 171x114 -unsharp 0x.5 "${OPTIONS.source}/${name}" "${pathThumbnails}/${name}"`;
const GET_COMMAND_LARGE = (name) => `convert -resize '1920x1920' "${OPTIONS.source}/${name}" "${pathLarge}/${name}"`;

function runCommand (cmd) {
  return new Promise((resolve, reject) => {
    const callback = (error) => error ? reject(error) : resolve();
    exec(cmd, callback);
  });
}

fs.mkdirSync(pathThumbnails, { recursive: true });
fs.mkdirSync(pathLarge, { recursive: true });

let images = fs.readdirSync(OPTIONS.source, { withFileTypes: true }).filter(f => f.isFile() && f.name[0] !== '.');

async function processFile (file) {
  let cmd = GET_COMMAND_THUMBNAIL(file.name);
  console.log(cmd);
  await runCommand(cmd);
  cmd = GET_COMMAND_LARGE(file.name);
  console.log(cmd);
  await runCommand(cmd);
}

(async function () {
  let count = 0;
  for (let i = 0; i < images.length; i++) {
    const file = images[i];
    try {
      console.log('PROCESSING FILE', `${Math.round((++count * 100) / images.length)}%`, file.name);
      await processFile(file);
    } catch (error) {
      console.warn(error);
    }
  }
}())

// @TODO Generate the data.yml file with a list of filenames