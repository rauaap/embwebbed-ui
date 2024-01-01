const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar');
const injectScript = require('./injectScript');

const options = (() => {
    const args = process.argv.slice(2);
    const options = {htmlDir: null, jsDir: null}
    let pos = 0;

    for (let i = 0; i < 4; i += 2) {
        const current = args[i];
        const next = args[i + 1];

        switch (current) {
        case '--html':
            options.htmlDir = next;
            break;
        case '--js':
            options.jsDir = next;
            break;
        default:
            return false;
        }
    }

    return options;
})();

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

const watcher = chokidar.watch(options.jsDir);

watcher.on('change', jsFilePath => {
    const fileName = path.parse(jsFilePath).name;
    const htmlFilePath = path.join(options.htmlDir, `${fileName}.html`);

    const statusCode = injectScript(jsFilePath, htmlFilePath);

    switch (statusCode) {
        case 0:
            console.log(`Succesfully injected ${fileName}.js.`);
            break;
        case 1:
            console.log(`No html file exists for ${fileName}.js.`);
            break;
        default:
            break;
    }
});

watcher.on('ready', () => console.log('Watching for changes...'));
