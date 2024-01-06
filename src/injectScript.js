const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const argParse = require('./argParse');

function injectScript(jsFilePath, htmlFilePath) {
    if (!fs.existsSync(jsFilePath)) {
        return 1;
    }
    if (!fs.existsSync(htmlFilePath)) {
        return 2;
    }

    const result = esbuild.buildSync({
        entryPoints: [jsFilePath],
        loader: {
            '.png': 'dataurl',
            '.svg': 'dataurl',
            '.webp': 'dataurl',
            '.jpg': 'dataurl'
        },
        bundle: true,
        minify: true,
        write: false,
    });

    const injectScript = `<script>${result.outputFiles[0].text.trim()}</script>`;

    let htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');

    htmlContent = htmlContent.replace(
        /<!-- BEGIN_INJECTED -->.*<!-- END_INJECTED -->/,
        `<!-- BEGIN_INJECTED -->${injectScript}<!-- END_INJECTED -->`
    );

    fs.writeFileSync(htmlFilePath, htmlContent);
    return 0;
}

module.exports = injectScript;

if (require.main === module) {
    const options = argParse();
    const statusCode = injectScript(options.js, options.html);

    const fileName = path.basename(options.js);
    if (statusCode == 0) {
        console.log(`Succesfully injected ${fileName}.`);
    }
    else {
        console.log(`Could not inject ${fileName}. Process exited with status code ${statusCode}.`)
    }
}
