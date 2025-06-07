from http.server import HTTPServer, SimpleHTTPRequestHandler
import sys

class NoCacheHTTPRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # 캐시 방지 헤더 추가
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        SimpleHTTPRequestHandler.end_headers(self)

    def do_GET(self):
        # 모든 GET 요청에 대해 캐시 방지
        self.send_response(200)
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        return SimpleHTTPRequestHandler.do_GET(self)

if __name__ == '__main__':
    port = 8000
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    
    server_address = ('', port)
    httpd = HTTPServer(server_address, NoCacheHTTPRequestHandler)
    print(f"서버 시작: http://localhost:{port}")
    print("캐시가 비활성화된 상태로 실행 중입니다.")
    print("서버를 중지하려면 Ctrl+C를 누르세요.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n서버를 중지합니다.")
        httpd.server_close() 