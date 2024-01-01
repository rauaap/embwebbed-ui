const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

function injectScript(jsFilePath, htmlFilePath) {
    if (!fs.existsSync(htmlFilePath)) {
        return 1;
    }

    const result = esbuild.buildSync({
        entryPoints: [jsFilePath],
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
