#!/usr/bin/env node

import path from 'path';
import injectScript from './injectScript.js';
import argParse from './argParse.js';

const options = argParse();
const statusCode = await injectScript(options.js, options.html);

const fileName = path.basename(options.js);
if (statusCode == 0) {
    console.log(`Succesfully injected ${fileName}.`);
}
else {
    console.log(`Could not inject ${fileName}. Process exited with status code ${statusCode}.`)
}

