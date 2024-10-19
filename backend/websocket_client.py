import asyncio
import websockets
import json
import time

async def flashcard_client():
    uri = "ws://localhost:8765"
    async with websockets.connect(uri) as websocket:
        print("Connection opened")
        
        try:
            while True:
                message = await websocket.recv()
                data = json.loads(message)
                
                if data['type'] == 'question':
                    question = data['data']
                    print(f"\nQuestion (Difficulty: {question['difficulty']}): {question['question']}")
                    print("Options:")
                    for option, text in question['options'].items():
                        print(f"{option}: {text}")

                    # Start timer
                    start_time = time.time()
                    
                    # Get user input
                    user_answer = input("Your answer (A/B/C/D): ").strip().upper()
                    
                    # Calculate time taken
                    time_taken = time.time() - start_time
                    
                    # Send answer back to server
                    response = {
                        "answer": user_answer,
                        "time_taken": time_taken
                    }
                    await websocket.send(json.dumps(response))

                elif data['type'] == 'answer_result':
                    is_correct = data['data']['is_correct']
                    correct_answer = data['data']['correct_answer']
                    result_text = "Correct!" if is_correct else f"Wrong. The correct answer is {correct_answer}."
                    print(result_text)

                elif data['type'] == 'report':
                    report = data['data']
                    print("\nQuiz Report:")
                    print(f"Total Questions: {report['total_questions']}")
                    print(f"Overall Accuracy: {report['overall_accuracy'] * 100:.2f}%")
                    print(f"Average Time per Question: {report['average_time']:.2f} seconds")
                    
                    for difficulty, performance in report["difficulty_performance"].items():
                        print(f"{difficulty} Performance - Accuracy: {performance['accuracy'] * 100:.2f}%, Average Time: {performance['average_time']:.2f} seconds")
                    
                    print("\nMost Challenging Questions:")
                    for question in report["challenging_questions"]:
                        print(f"Question: {question['question'][:50]}...")
                        print(f"  Accuracy: {question['accuracy'] * 100:.2f}%, Average Time: {question['average_time']:.2f} seconds")
                    
                    break  # Exit after receiving the report

        except websockets.exceptions.ConnectionClosed:
            print("Connection closed")

if __name__ == "__main__":
    asyncio.get_event_loop().run_until_complete(flashcard_client())