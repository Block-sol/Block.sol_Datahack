import asyncio
import websockets
import json
import time
from datetime import datetime

async def flashcard_client():
    uri = "ws://localhost:8765"  # Ensure this matches the running WebSocket server
    async with websockets.connect(uri) as websocket:
        print("Connection opened")
        session_start = datetime.now()
        
        try:
            while True:
                message = await websocket.recv()  # Receive message from the server
                data = json.loads(message)
                print(data)
                if data['type'] == 'question':
                    question = data['data']
                    print(f"\nQuestion (Difficulty: {question['difficulty']}): {question['question']}")
                    print("\nOptions:")
                    for option, text in question['options'].items():
                        print(f"{option}: {text}")

                    # Start timer
                    start_time = time.time()
                    
                    # Get user input
                    user_answer = input("\nYour answer (A/B/C/D): ").strip().upper()
                    while user_answer not in ['A', 'B', 'C', 'D']:
                        print("Invalid input! Please enter A, B, C, or D.")
                        user_answer = input("Your answer (A/B/C/D): ").strip().upper()
                    
                    # Calculate time taken
                    time_taken = time.time() - start_time
                    
                    # Send answer back to server
                    response = {
                        "answer": user_answer,
                        "time_taken": time_taken
                    }
                    await websocket.send(json.dumps(response))  # Send the response back to the server

                elif data['type'] == 'answer_result':
                    result = data['data']
                    is_correct = result['is_correct']
                    correct_answer = result['correct_answer']
                    
                    if is_correct:
                        print("\n✓ Correct!")
                    else:
                        print(f"\n✗ Wrong. The correct answer is {correct_answer}.")
                        print(f"Explanation: {result['explanation']}")

                elif data['type'] == 'report':
                    report = data['data']
                    session_duration = datetime.now() - session_start
                    
                    print("\n" + "="*50)
                    print("QUIZ REPORT")
                    print("="*50)
                    
                    print("\nSession Summary:")
                    print(f"Duration: {session_duration.total_seconds():.0f} seconds")
                    print(f"Total Questions: {report['total_questions']}")
                    print(f"Correct Answers: {report['total_correct']}")
                    print(f"Wrong Answers: {report['total_wrong']}")
                    print(f"Overall Accuracy: {report['overall_accuracy'] * 100:.2f}%")
                    print(f"Average Time per Question: {report['average_time']:.2f} seconds")
                    
                    print("\nPerformance by Difficulty:")
                    for difficulty, performance in report["difficulty_performance"].items():
                        print(f"\n{difficulty} Level:")
                        print(f"  Questions Attempted: {performance['total_questions']}")
                        print(f"  Accuracy: {performance['accuracy'] * 100:.2f}%")
                        print(f"  Average Time: {performance['average_time']:.2f} seconds")
                    
                    print("\nMost Challenging Questions:")
                    for i, question in enumerate(report["challenging_questions"], 1):
                        print(f"\n{i}. Question: {question['question']}")
                        print(f"   Accuracy: {question['accuracy'] * 100:.2f}%")
                        print(f"   Average Time: {question['average_time']:.2f} seconds")
                        print(f"   Total Attempts: {question['attempts']}")
                    
                    if report["wrong_answers"]:
                        print("\nQuestions Answered Incorrectly:")
                        for i, wrong in enumerate(report["wrong_answers"], 1):
                            print(f"\n{i}. Question: {wrong['question']}")
                            print(f"   Difficulty: {wrong['difficulty']}")
                            print(f"   Your Answer: {wrong['user_answer']} "
                                  f"({wrong['options'][wrong['user_answer']]})")
                            print(f"   Correct Answer: {wrong['correct_answer']} "
                                  f"({wrong['options'][wrong['correct_answer']]})")
                            print(f"   Time Taken: {wrong['time_taken']:.2f} seconds")
                    else:
                        print("\nCongratulations! You had no wrong answers!")
                    
                    print("\n" + "="*50)
                    break  # Exit after receiving the report

        except websockets.exceptions.ConnectionClosed:
            print("\nConnection closed")

if __name__ == "__main__":
    try:
        asyncio.get_event_loop().run_until_complete(flashcard_client())
    except KeyboardInterrupt:
        print("\nQuiz session terminated by user.")
    except Exception as e:
        print(f"\nAn error occurred: {str(e)}")
