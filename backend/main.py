import asyncio
from websocket_server import FlashcardWebSocketServer
from questiongeneration import question_generation

async def main():
    host = "localhost"
    port = 8765
    questions_file = "output.json"

    # Call the synchronous question_generation function
    question_generation('nlp.pdf', 'output.json')

    # Start WebSocket server after question_generation is complete
    # server = FlashcardWebSocketServer(host, port, questions_file)
    # await server.start_server()
    # await asyncio.get_event_loop().run_forever()

if __name__ == "__main__":
    asyncio.run(main())
