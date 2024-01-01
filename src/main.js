const path = require('path');
const chokidar = require('chokidar');
const injectScript = require('./injectScript');

const watcher = chokidar.watch(path.join(__dirname, 'js'));

watcher.on('change', filePath => {
    const fileName = path.parse(filePath).base;
    const statusCode = injectScript(fileName);

    switch (statusCode) {
        case 0:
            console.log(`Succesfully injected ${fileName}.`);
            break;
        case 1:
            console.log(`No html file exists for ${fileName}.`);
            break;
        default:
            break;
    }
});

watcher.on('ready', () => console.log('Watching for changes...'));
