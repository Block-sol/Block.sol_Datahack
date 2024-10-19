import asyncio
from websocket_server import FlashcardWebSocketServer

if __name__ == "__main__":
    host = "localhost"
    port = 8765
    questions_file = "data/sample.json"

    server = FlashcardWebSocketServer(host, port, questions_file)
    asyncio.get_event_loop().run_until_complete(server.start_server())
    asyncio.get_event_loop().run_forever()