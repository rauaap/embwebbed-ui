import os
import bottle
import livereload

script_directory = os.path.dirname(os.path.abspath(__file__))
html_directory = os.path.join(script_directory, '../src/html')

bottle.debug(True) # required for autoreload
app = bottle.Bottle()

@app.route('/')
def index():
    return bottle.static_file('index.html', root = html_directory)

server = livereload.Server(app)
server.watch(html_directory)
server.serve()
