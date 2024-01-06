#!/usr/bin/env node

import path from 'path';
import fs from 'fs';
import chokidar from 'chokidar';

import injectScript from './injectScript.js';
import argParse from './argParse.js';

const options = argParse();

if (!options) {
    console.error(
        'Usage: node main.js --html [html file directory] --js [js file directory]'
    );

    process.exit(1);
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

        process.exit(1);
    }
}

const fileExtensions = ['*.js', '*.ts', '*.jsx', '*.tsx', '*.svelte'];
const watcher = chokidar.watch(
    fileExtensions.map( ext => path.join(options.js, ext) )
);

watcher.on('change', async jsFilePath => {
    const {base, name} = path.parse(jsFilePath);
    const htmlFilePath = path.join(options.html, `${name}.html`);

    let statusCode;

    try {
        statusCode = await injectScript(jsFilePath, htmlFilePath);
    }
    catch (e) {
        console.log(e);
    }

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
