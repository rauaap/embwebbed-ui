#!/usr/bin/env node

const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');
const injectScript = require('./injectScript');
const argParse = require('./argParse');

const options = argParse();

if (!options) {
    console.error(
        'Usage: node main.js --html [html file directory] --js [js file directory]'
    );

    return;
}

for (const [key, value] of Object.entries(options)) {
    if (value === null) {
        options[key] = '.';
        continue;
    }

    if (!fs.existsSync(value) || !fs.statSync(value).isDirectory()) {
        console.error(
            'Both --html and --js must provide existing directories.'
        );

        return;
    }
}

const fileExtensions = ['*.js', '*.ts', '*.jsx', '*.tsx'];
const watcher = chokidar.watch(
    fileExtensions.map( ext => path.join(options.js, ext) )
);

watcher.on('change', jsFilePath => {
    const {base, name} = path.parse(jsFilePath);
    const htmlFilePath = path.join(options.html, `${name}.html`);

    const statusCode = injectScript(jsFilePath, htmlFilePath);

    switch (statusCode) {
        case 0:
            console.log(`Succesfully injected ${base}.`);
            break;
        case 1:
            console.log(`${base} does not exist.`);
        case 2:
            console.log(`No html file exists for ${base}.`);
            break;
        default:
            break;
    }
});

watcher.on('ready', () => console.log('Watching for changes...'));
