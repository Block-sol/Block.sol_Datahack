import numpy as np
import time
from datetime import datetime, timedelta
import json
from typing import List, Dict, Any
import random

class AdaptiveQuizSystem:
    def __init__(self, questions: List[Dict[str, Any]], spaced_interval_days: List[int] = [1, 3, 7, 14, 30]):
        self.questions = questions
        self.difficulty_levels = ['Easy', 'Medium', 'Hard']
        self.spaced_interval_days = spaced_interval_days
        
        # Initialize Q-learning parameters
        self.q_table = self._initialize_q_table()
        self.learning_rate = 0.1
        self.discount_factor = 0.9
        self.epsilon = 0.1  # For exploration
        
        # Track user performance
        self.user_performance = {
            'correct_answers': 0,
            'total_questions': 0,
            'difficulty_history': [],
            'response_times': [],
            'question_history': [],
            'spaced_repetition_queue': []
        }
        
        # Initialize difficulty distribution
        self.difficulty_weights = {
            'Easy': 0.4,
            'Medium': 0.3,
            'Hard': 0.3
        }

    def _initialize_q_table(self) -> Dict:
        """Initialize Q-table with states (difficulty levels) and actions (next difficulty levels)"""
        q_table = {}
        for diff in self.difficulty_levels:
            q_table[diff] = {
                'Easy': 0.0,
                'Medium': 0.0,
                'Hard': 0.0
            }
        return q_table

    def _get_reward(self, correct: bool, response_time: float, difficulty: str) -> float:
        """Calculate reward based on answer correctness, response time, and difficulty"""
        base_reward = 1.0 if correct else -1.0
        
        # Time penalty (normalized between 0 and 1)
        time_factor = min(1.0, max(0.0, 1 - (response_time / 60.0)))  # Assuming 60 seconds is max
        
        # Difficulty bonus
        difficulty_bonus = {
            'Easy': 1.0,
            'Medium': 1.5,
            'Hard': 2.0
        }[difficulty]
        
        return base_reward * (1 + time_factor) * difficulty_bonus

    def _select_next_difficulty(self, current_difficulty: str) -> str:
        """Select next difficulty level using epsilon-greedy strategy"""
        if random.random() < self.epsilon:
            return random.choice(self.difficulty_levels)
        
        q_values = self.q_table[current_difficulty]
        return max(q_values.items(), key=lambda x: x[1])[0]

    def _select_question(self, difficulty: str) -> Dict:
        """Select a question of given difficulty that hasn't been recently asked"""
        available_questions = [
            q for q in self.questions 
            if q['difficulty'] == difficulty 
            and q not in self.user_performance['question_history'][-5:]
        ]
        
        if not available_questions:
            available_questions = [q for q in self.questions if q['difficulty'] == difficulty]
        
        return random.choice(available_questions)

    def _update_spaced_repetition(self, question: Dict, correct: bool):
        """Update spaced repetition queue based on answer correctness"""
        if not correct:
            next_review = datetime.now() + timedelta(days=self.spaced_interval_days[0])
            self.user_performance['spaced_repetition_queue'].append({
                'question': question,
                'review_date': next_review,
                'interval_index': 0
            })

    def ask_question(self) -> tuple:
        """Ask a question and return question details"""
        # Check if there are any due spaced repetition questions
        current_time = datetime.now()
        due_questions = [
            q for q in self.user_performance['spaced_repetition_queue']
            if q['review_date'] <= current_time
        ]
        
        if due_questions:
            question = due_questions[0]['question']
            self.user_performance['spaced_repetition_queue'].remove(due_questions[0])
        else:
            # Select new question based on current performance
            if self.user_performance['difficulty_history']:
                current_difficulty = self.user_performance['difficulty_history'][-1]
                next_difficulty = self._select_next_difficulty(current_difficulty)
            else:
                next_difficulty = 'Easy'
            
            question = self._select_question(next_difficulty)
        
        self.user_performance['question_history'].append(question)
        return question

    def process_answer(self, question: Dict, user_answer: str, response_time: float) -> Dict:
        """Process user's answer and update the model"""
        correct = user_answer.upper() == question['correctAnswer'].upper()
        current_difficulty = question['difficulty']
        
        # Calculate reward
        reward = self._get_reward(correct, response_time, current_difficulty)
        
        # Update Q-table
        next_difficulty = self._select_next_difficulty(current_difficulty)
        max_next_q = max(self.q_table[next_difficulty].values())
        self.q_table[current_difficulty][next_difficulty] += self.learning_rate * (
            reward + self.discount_factor * max_next_q - 
            self.q_table[current_difficulty][next_difficulty]
        )
        
        # Update user performance
        self.user_performance['correct_answers'] += int(correct)
        self.user_performance['total_questions'] += 1
        self.user_performance['difficulty_history'].append(current_difficulty)
        self.user_performance['response_times'].append(response_time)
        
        # Update spaced repetition if answer was incorrect
        self._update_spaced_repetition(question, correct)
        
        # Calculate performance metrics
        accuracy = (self.user_performance['correct_answers'] / 
                   self.user_performance['total_questions'] * 100)
        avg_response_time = np.mean(self.user_performance['response_times'])
        
        return {
            'correct': correct,
            'accuracy': accuracy,
            'average_response_time': avg_response_time,
            'current_difficulty': current_difficulty,
            'next_difficulty': next_difficulty
        }

    def get_performance_summary(self) -> Dict:
        """Generate a comprehensive performance summary"""
        if not self.user_performance['total_questions']:
            return {'message': 'No questions attempted yet'}
        
        difficulty_counts = {}
        for diff in self.difficulty_levels:
            count = self.user_performance['difficulty_history'].count(diff)
            difficulty_counts[diff] = count
        
        return {
            'total_questions': self.user_performance['total_questions'],
            'correct_answers': self.user_performance['correct_answers'],
            'accuracy': (self.user_performance['correct_answers'] / 
                        self.user_performance['total_questions'] * 100),
            'average_response_time': np.mean(self.user_performance['response_times']),
            'difficulty_distribution': difficulty_counts,
            'learning_progress': self.q_table,
            'questions_for_review': len(self.user_performance['spaced_repetition_queue'])
        }

# Example usage
def run_quiz_session():
    # Initialize quiz system with your questions
    quiz = AdaptiveQuizSystem(questions)  # questions is your provided question bank
    
    total_questions = 10  # Set how many questions you want to ask
    
    for i in range(total_questions):
        # Get next question
        question = quiz.ask_question()
        
        # Display question
        print(f"\nQuestion {i+1} (Difficulty: {question['difficulty']})")
        print(question['question'])
        for option, text in question['options'].items():
            print(f"{option}: {text}")
        
        # Get user input and measure response time
        start_time = time.time()
        user_answer = input("Your answer (A/B/C/D): ").strip().upper()
        response_time = time.time() - start_time
        
        # Process answer and get feedback
        result = quiz.process_answer(question, user_answer, response_time)
        
        # Display immediate feedback
        print(f"{'Correct!' if result['correct'] else 'Incorrect.'}")
        print(f"Response time: {response_time:.2f} seconds")
        print(f"Current accuracy: {result['accuracy']:.1f}%")
    
    # Display final summary
    summary = quiz.get_performance_summary()
    print("\nQuiz Complete! Final Summary:")
    print(f"Total Questions: {summary['total_questions']}")
    print(f"Correct Answers: {summary['correct_answers']}")
    print(f"Final Accuracy: {summary['accuracy']:.1f}%")
    print(f"Average Response Time: {summary['average_response_time']:.2f} seconds")
    print("\nDifficulty Distribution:")
    for diff, count in summary['difficulty_distribution'].items():
        print(f"{diff}: {count} questions")
    print(f"\nQuestions queued for review: {summary['questions_for_review']}")

if __name__ == "__main__":
    run_quiz_session()