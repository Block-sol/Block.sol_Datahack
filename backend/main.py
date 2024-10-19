import json
import random
from datetime import datetime, timedelta

class AdaptiveFlashcardSystem:
    def __init__(self, file_path):
        self.questions = self.load_questions(file_path)
        self.user_performance = {}
        self.question_history = []
        self.current_difficulty = "Easy"
        self.spaced_repetition_queue = []

    def load_questions(self, file_path):
        with open(file_path, 'r') as file:
            data = json.load(file)
        return data['questions']

    def select_question(self):
        current_time = datetime.now()
        while self.spaced_repetition_queue and self.spaced_repetition_queue[0][0] <= current_time:
            _, question = self.spaced_repetition_queue.pop(0)
            return question
        
        available_questions = [q for q in self.questions if q['difficulty'] == self.current_difficulty]
        if not available_questions:
            self.adjust_difficulty()
            available_questions = [q for q in self.questions if q['difficulty'] == self.current_difficulty]
        
        return random.choice(available_questions)

    def adjust_difficulty(self):
        difficulties = ["Easy", "Medium", "Hard"]
        current_index = difficulties.index(self.current_difficulty)
        if self.get_recent_accuracy() > 0.7 and current_index < 2:
            self.current_difficulty = difficulties[current_index + 1]
        elif self.get_recent_accuracy() < 0.3 and current_index > 0:
            self.current_difficulty = difficulties[current_index - 1]

    def get_recent_accuracy(self):
        recent_attempts = self.question_history[-5:]
        if not recent_attempts:
            return 0.5
        return sum(1 for q in recent_attempts if q['correct']) / len(recent_attempts)

    def ask_question(self, question):
        print(f"\nQuestion ({question['difficulty']}): {question['question']}")
        for option, text in question['options'].items():
            print(f"{option}: {text}")
        
        start_time = datetime.now()
        user_answer = input("Your answer (A/B/C/D): ").upper()
        end_time = datetime.now()
        time_taken = (end_time - start_time).total_seconds()

        is_correct = user_answer == question['correctAnswer']
        self.update_performance(question, is_correct, time_taken)
        
        print("Correct!" if is_correct else f"Wrong. The correct answer is {question['correctAnswer']}.")
        return is_correct, time_taken

    def update_performance(self, question, is_correct, time_taken):
        q_id = question['question']
        if q_id not in self.user_performance:
            self.user_performance[q_id] = {'attempts': 0, 'correct': 0, 'total_time': 0}
        
        self.user_performance[q_id]['attempts'] += 1
        self.user_performance[q_id]['correct'] += int(is_correct)
        self.user_performance[q_id]['total_time'] += time_taken

        self.question_history.append({
            'question': q_id,
            'difficulty': question['difficulty'],
            'correct': is_correct,
            'time_taken': time_taken,
            'timestamp': datetime.now()
        })

        if not is_correct:
            self.schedule_for_repetition(question)

    def schedule_for_repetition(self, question):
        repetition_intervals = [5, 25, 120]  # in minutes
        for interval in repetition_intervals:
            review_time = datetime.now() + timedelta(minutes=interval)
            self.spaced_repetition_queue.append((review_time, question))
        self.spaced_repetition_queue.sort(key=lambda x: x[0])

    def run_session(self, num_questions=10):
        for _ in range(num_questions):
            question = self.select_question()
            self.ask_question(question)
            self.adjust_difficulty()

    def generate_report(self):
        total_questions = len(self.question_history)
        total_correct = sum(1 for q in self.question_history if q['correct'])
        overall_accuracy = total_correct / total_questions if total_questions > 0 else 0
        average_time = sum(q['time_taken'] for q in self.question_history) / total_questions if total_questions > 0 else 0

        print("\n--- Performance Report ---")
        print(f"Total Questions Attempted: {total_questions}")
        print(f"Overall Accuracy: {overall_accuracy:.2%}")
        print(f"Average Time per Question: {average_time:.2f} seconds")

        print("\nPerformance by Difficulty:")
        for difficulty in ["Easy", "Medium", "Hard"]:
            questions = [q for q in self.question_history if q['difficulty'] == difficulty]
            if questions:
                accuracy = sum(1 for q in questions if q['correct']) / len(questions)
                avg_time = sum(q['time_taken'] for q in questions) / len(questions)
                print(f"  {difficulty}: Accuracy: {accuracy:.2%}, Avg Time: {avg_time:.2f} seconds")

        print("\nMost Challenging Questions:")
        sorted_performance = sorted(self.user_performance.items(), key=lambda x: x[1]['correct'] / x[1]['attempts'])
        for q_id, perf in sorted_performance[:3]:
            accuracy = perf['correct'] / perf['attempts']
            avg_time = perf['total_time'] / perf['attempts']
            print(f"  Question: {q_id[:50]}...")
            print(f"    Accuracy: {accuracy:.2%}, Avg Time: {avg_time:.2f} seconds")

if __name__ == "__main__":
    flashcard_system = AdaptiveFlashcardSystem('data/sample.json')
    flashcard_system.run_session(num_questions=15)
    flashcard_system.generate_report()