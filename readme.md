# Embwebbed-UI

Tools for developing browser based interfaces for IOT-devices:

- `server/main.py`: An autoreload web server for previewing the web pages and simulating the endpoints of the device. Watches the `src/html/` directory for changes.
- `tools/make_html.py`: A script for condensing the HTML pages and writing them into a header file for the IOT device.
- `src/injectScript.js`: A script that uses esbuild to bundle JavaScript and then injects it into a corresponsing HTML file inline. This script is automatically run by the `src/main.js` script which uses chokidar to watch the JavaScript files for changes.
