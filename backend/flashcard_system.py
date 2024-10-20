import json
import random
from datetime import datetime, timedelta

class AdaptiveFlashcardSystem:
    def __init__(self, file_path):
        # Store the file path in an instance variable
        self.questions_file = file_path
        self.questions = self.load_questions()  # No need to pass file_path again
        self.user_performance = {}
        self.question_history = []
        self.current_difficulty = "Easy"
        self.spaced_repetition_queue = []
        self.wrong_answers = []  # List to track wrong answers

    def load_questions(self):
        """Load the latest questions from the output.json file."""
        try:
            # Always open the file to ensure you are loading the latest version
            with open(self.questions_file, 'r') as file:
                data = json.load(file)
                return data  # Assumes your JSON file has a 'questions' key
        except FileNotFoundError:
            print(f"Error: {self.questions_file} not found.")
            return []
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            return [] # No need for ['questions'], just load the entire list of questions

    def select_question(self):
        current_time = datetime.now()
        # Handle spaced repetition queue
        while self.spaced_repetition_queue and self.spaced_repetition_queue[0][0] <= current_time:
            _, question = self.spaced_repetition_queue.pop(0)
            return question
        
        # Filter questions based on current difficulty
        available_questions = [q for q in self.questions if q['difficulty'] == self.current_difficulty]
        if not available_questions:
            self.adjust_difficulty()
            available_questions = [q for q in self.questions if q['difficulty'] == self.current_difficulty]
        
        return random.choice(available_questions)

    def adjust_difficulty(self):
        difficulties = ["Easy", "Medium", "Hard"]
        current_index = difficulties.index(self.current_difficulty)
        # Adjust difficulty based on performance
        if self.get_recent_accuracy() > 0.7 and current_index < 2:
            self.current_difficulty = difficulties[current_index + 1]
        elif self.get_recent_accuracy() < 0.3 and current_index > 0:
            self.current_difficulty = difficulties[current_index - 1]

    def get_recent_accuracy(self):
        recent_attempts = self.question_history[-5:]  # Check recent attempts for accuracy
        if not recent_attempts:
            return 0.5  # Default accuracy
        return sum(1 for q in recent_attempts if q['correct']) / len(recent_attempts)

    def process_answer(self, question, user_answer, time_taken):
        is_correct = user_answer.upper() == question['correctAnswer']
        self.update_performance(question, is_correct, time_taken)
        
        # Track wrong answers with details
        if not is_correct:
            wrong_answer_detail = {
                'id': question['id'],
                'question': question['question'],
                'user_answer': user_answer,
                'correct_answer': question['correctAnswer'],
                'options': question['options'],
                'difficulty': question['difficulty'],
                'time_taken': time_taken,
                'explanation':question['explanation']
            }
            self.wrong_answers.append(wrong_answer_detail)
            
        return is_correct

    def update_performance(self, question, is_correct, time_taken):
        q_id = question['id']  # Use 'id' instead of question text
        if q_id not in self.user_performance:
            self.user_performance[q_id] = {'attempts': 0, 'correct': 0, 'total_time': 0}
        
        self.user_performance[q_id]['attempts'] += 1
        self.user_performance[q_id]['correct'] += int(is_correct)
        self.user_performance[q_id]['total_time'] += time_taken

        # Append to question history with question 'id'
        self.question_history.append({
            'id': q_id,
            'difficulty': question['difficulty'],
            'correct': is_correct,
            'time_taken': time_taken,
            'timestamp': datetime.now().isoformat()
        })

        if not is_correct:
            self.schedule_for_repetition(question)

    def schedule_for_repetition(self, question):
        # Schedule the question for repetition at different intervals
        repetition_intervals = [5, 25, 120]  # in minutes
        for interval in repetition_intervals:
            review_time = datetime.now() + timedelta(minutes=interval)
            self.spaced_repetition_queue.append((review_time, question))
        self.spaced_repetition_queue.sort(key=lambda x: x[0])

    def generate_report(self):
        total_questions = len(self.question_history)
        total_correct = sum(1 for q in self.question_history if q['correct'])
        overall_accuracy = total_correct / total_questions if total_questions > 0 else 0
        average_time = sum(q['time_taken'] for q in self.question_history) / total_questions if total_questions > 0 else 0
    
        report = {
            "total_questions": total_questions,
            "total_correct": total_correct,
            "total_wrong": len(self.wrong_answers),
            "overall_accuracy": overall_accuracy,
            "average_time": average_time,
            "difficulty_performance": {},
            "challenging_questions": [],
            "wrong_answers": self.wrong_answers,  # Include wrong answers in the report
            "detailed_question_performance": []  # New section to include all fields for each question
        }
    
        # Loop through the performance and gather details for each question
        for question in self.questions:
            q_id = question['id']
            performance = self.user_performance.get(q_id, None)
            if performance:
                attempts = performance['attempts']
                correct = performance['correct']
                accuracy = correct / attempts if attempts > 0 else 0
                avg_time = performance['total_time'] / attempts if attempts > 0 else 0
            else:
                # If no performance data, initialize as default values
                attempts = 0
                correct = 0
                accuracy = 0
                avg_time = 0
    
            # Append detailed question info to the report
            report["detailed_question_performance"].append({
                "id": question['id'],
                "question": question['question'],
                "options": question['options'],
                "correctAnswer": question['correctAnswer'],
                "related_topics": question['related_topics'],
                "related_links": question['related_links'],
                "difficulty": question['difficulty'],
                "user_attempts": attempts,
                "correct_attempts": correct,
                "accuracy": accuracy,
                "average_time_taken": avg_time,
                "explanation":question['explanation']
            })
    
        # Calculate performance based on difficulty
        for difficulty in ["Easy", "Medium", "Hard"]:
            questions = [q for q in self.question_history if q['difficulty'] == difficulty]
            if questions:
                accuracy = sum(1 for q in questions if q['correct']) / len(questions)
                avg_time = sum(q['time_taken'] for q in questions) / len(questions)
                report["difficulty_performance"][difficulty] = {
                    "accuracy": accuracy,
                    "average_time": avg_time,
                    "total_questions": len(questions)
                }
    
        # Get the most challenging questions
        sorted_performance = sorted(
            self.user_performance.items(),
            key=lambda x: (x[1]['correct'] / x[1]['attempts'], x[1]['total_time'] / x[1]['attempts'])
        )
        
        for q_id, perf in sorted_performance[:3]:
            accuracy = perf['correct'] / perf['attempts']
            avg_time = perf['total_time'] / perf['attempts']
            # Add the question details for challenging questions
            question = next(q for q in self.questions if q['id'] == q_id)
            report["challenging_questions"].append({
                "id": question['id'],
                "question": question['question'],
                "options": question['options'],
                "correctAnswer": question['correctAnswer'],
                "related_topics": question['related_topics'],
                "related_links": question['related_links'],
                "difficulty": question['difficulty'],
                "explanation":question['explanation'],
                "accuracy": accuracy,
                "average_time": avg_time,
                "attempts": perf['attempts']
            })
    
        return report
    