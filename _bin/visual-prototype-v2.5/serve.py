#!/usr/bin/env python3
"""Loopback-only static Director v2.5 preview."""
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent
class Handler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def do_GET(self):
        requested = self.path.split('?', 1)[0]
        target = (ROOT / requested.lstrip('/')).resolve()
        if target.suffix == '.html' and target.is_file() and ROOT in target.parents and target.name != 'index.html':
            document = target.read_text(encoding='utf-8')
            scripts = '<script defer src="app-core.js"></script><script defer src="director-logic.js"></script><script defer src="functional-runtime.js"></script>'
            body = document.replace('</head>', scripts + '</head>').encode('utf-8')
            self.send_response(200)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return
        super().do_GET()

if __name__ == '__main__':
    print('Director v2.5 visual prototype: http://127.0.0.1:4176', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 4176), partial(Handler, directory=str(ROOT))).serve_forever()
