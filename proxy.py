from http.server import HTTPServer, SimpleHTTPRequestHandler
import urllib.request
import json

API_KEY = "yourAPIkey"
MODEL = "llama3-8b-8192"

class ProxyHandler(SimpleHTTPRequestHandler):

    def do_OPTIONS(self):
        self.send_response(200)
        self._cors()
        self.end_headers()

    def do_POST(self):
        print("POST received to:", self.path)
        if self.path == '/chat':
            try:
                length = int(self.headers.get('Content-Length', 0))
                print("Reading body, length:", length)
                body = json.loads(self.rfile.read(length))
                print("Body parsed OK")

                groq_body = json.dumps({
                    "model": MODEL,
                    "messages": [
                        {"role": "system", "content": body["system"]}
                    ] + body["messages"]
                }).encode()
                print("Groq body built OK")

                req = urllib.request.Request(
                    "https://api.groq.com/openai/v1/chat/completions",
                    data=groq_body,
                    headers={
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + API_KEY
                    },
                    method="POST"
                )
                print("Sending to Groq...")

                with urllib.request.urlopen(req) as resp:
                    raw = resp.read()
                    print("Groq responded:", raw[:200])
                    groq_data = json.loads(raw)

                result = {
                    "content": [{
                        "type": "text",
                        "text": groq_data["choices"][0]["message"]["content"]
                    }]
                }

                self.send_response(200)
                self._cors()
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps(result).encode())
                print("Response sent OK")

            except Exception as e:
                print("ERROR:", str(e))
                import traceback
                traceback.print_exc()
                self.send_response(500)
                self._cors()
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())

    def _cors(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def log_message(self, f, *a):
        print("[Footy]", f % a)

if __name__ == "__main__":
    print("Footy proxy running at http://localhost:8000")
    HTTPServer(("", 8000), ProxyHandler).serve_forever()