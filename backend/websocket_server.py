import asyncio
import json
import websockets
from flashcard_system import AdaptiveFlashcardSystem

class FlashcardWebSocketServer:
    def __init__(self, host, port, questions_file):
        self.host = host
        self.port = port
        self.flashcard_system = AdaptiveFlashcardSystem(questions_file)

    async def handle_client(self, websocket, path):
        try:
            for _ in range(15):  # Adjust the number of questions as needed
                question = self.flashcard_system.select_question()
                await websocket.send(json.dumps({
                    "type": "question",
                    "data": question
                }))

                response = await websocket.recv()
                response_data = json.loads(response)
                user_answer = response_data["answer"]
                time_taken = response_data["time_taken"]

                is_correct = self.flashcard_system.process_answer(question, user_answer, time_taken)
                await websocket.send(json.dumps({
                    "type": "answer_result",
                    "data": {
                        "is_correct": is_correct,
                        "correct_answer": question["correctAnswer"],
                        "question": question["question"],
                        "explanation": question.get("explanation", "No explanation provided.")
                    }
                }))

                self.flashcard_system.adjust_difficulty()

            report = self.flashcard_system.generate_report()
            await websocket.send(json.dumps({
                "type": "report",
                "data": report
            }))

        except websockets.exceptions.ConnectionClosed:
            print("Client disconnected")

    async def start_server(self):
        server = await websockets.serve(self.handle_client, self.host, self.port)
        print(f"WebSocket server started on ws://{self.host}:{self.port}")
        await server.wait_closed()