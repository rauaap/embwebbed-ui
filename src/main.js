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

for (let opt of Object.values(options)) {
    if (!fs.existsSync(opt) || !fs.statSync(opt).isDirectory()) {
        console.error(
            'Both --html and --js must provide existing directories.'
        );

        return;
    }
}

const watcher = chokidar.watch(path.join(options.js, '*.js'));

watcher.on('change', jsFilePath => {
    const fileName = path.parse(jsFilePath).name;
    const htmlFilePath = path.join(options.html, `${fileName}.html`);

    const statusCode = injectScript(jsFilePath, htmlFilePath);

    switch (statusCode) {
        case 0:
            console.log(`Succesfully injected ${fileName}.js.`);
            break;
        case 1:
            console.log(`${fileName}.js does not exist.`);
        case 2:
            console.log(`No html file exists for ${fileName}.js.`);
            break;
        default:
            break;
    }
});

watcher.on('ready', () => console.log('Watching for changes...'));
