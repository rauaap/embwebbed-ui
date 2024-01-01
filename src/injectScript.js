const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const jsDir = path.join(__dirname, 'js');
const htmlDir = path.join(__dirname, 'html');

function injectScript(jsFile) {
    const htmlFile = `${path.parse(jsFile).name}.html`;
    const htmlPath = path.join(htmlDir, htmlFile);

    if (!fs.existsSync(htmlPath)) {
        return 1;
    }

    const result = esbuild.buildSync({
        entryPoints: [path.join(jsDir, jsFile)],
        bundle: true,
        minify: true,
        write: false,
    });

    const injectScript = `<script>${result.outputFiles[0].text.trim()}</script>`;

    let htmlContent = fs.readFileSync(htmlPath, 'utf-8');

    htmlContent = htmlContent.replace(
        /<!-- BEGIN_INJECTED -->.*<!-- END_INJECTED -->/,
        `<!-- BEGIN_INJECTED -->${injectScript}<!-- END_INJECTED -->`
    );

    fs.writeFileSync(htmlPath, htmlContent);
    return 0;
}

module.exports = injectScript;
