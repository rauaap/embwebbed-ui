function argParse() {
    const args = process.argv.slice(2);
    const options = {html: null, js: null}

    for (let pos = 0; args[pos]; pos++) {
        switch (args[pos]) {
        case '--html':
            options.html = args[++pos];
            break;
        case '--js':
            options.js = args[++pos];
            break;
        case undefined:
            return options;
        default:
            return false;
        }
    }

    if (options.html === undefined || options.js === undefined) {
        return false;
    }
    else {
        return options;
    }
};

module.exports = argParse;
