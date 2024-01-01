# Embwebbed-UI

Tools for developing browser based interfaces for IOT-devices:

- `tools/make_html.py`: A script for condensing the HTML pages and writing them into a header file for the IOT device.
- `src/injectScript.js`: A script that uses esbuild to bundle JavaScript and then injects it into the corresponding HTML file inline. Used by `src/main.js` but can also be run as a script. Takes arguments `--js` and `--html` where `--js` is the JavaScript file to be bundled and `--html` is the HTML file to be injected with the bundled JavaScript.
- `src/main.js`: The main script which takes arguments `--html` and `--js` which are folders containing the JavaScript and HTML files. The files in the folder provided by `--js` are watched for changes, automatically bundled by esbuild and finally injected into the corresponding HTML file in the folder provided by `--html`.
