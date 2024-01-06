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

    const clientEnv = { 'process.env.NODE_ENV': `"production"` };
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
        define: clientEnv
    });

    const injectScript = `<script>${result.outputFiles[0].text.trim()}</script>`;
    const htmlContent = fs.readFileSync(htmlFilePath, 'utf-8');

    const startMarker = '<!-- BEGIN_INJECTED -->';
    const endMarker = '<!-- END_INJECTED -->';
    const injectionStart = htmlContent.indexOf(startMarker) + startMarker.length;
    const injectionEnd = htmlContent.indexOf(endMarker);
    const beforeInjected = htmlContent.slice(0, injectionStart);
    const afterInjected = htmlContent.slice(injectionEnd);

    const newContent = beforeInjected.concat(injectScript, afterInjected);

    fs.writeFileSync(htmlFilePath, newContent);
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
