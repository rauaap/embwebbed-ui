function argParse() {
    const args = process.argv.slice(2);
    const options = {html: null, js: null}
    let pos = 0;

    for (let i = 0; i < 4; i += 2) {
        const current = args[i];
        const next = args[i + 1];

        switch (current) {
        case '--html':
            options.html = next;
            break;
        case '--js':
            options.js = next;
            break;
        default:
            return false;
        }
    }

    return options;
};

module.exports = argParse;
