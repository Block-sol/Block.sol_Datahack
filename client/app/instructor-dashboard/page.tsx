'use client'
import React from 'react';
import InstructorDashboard from './InstructorDashboard';

const userData = {
    "users": {
      "bhavikpunmiya@gmail.com": {
        "username": "user123",
        "createdAt": "2024-01-15T12:34:56Z",
        "updatedAt": "2024-10-20T08:00:00Z",
        "tests": {
          "test456": {
            "type": "report",
            "data": {
              "total_questions": 43,
              "total_correct": 11,
              "total_wrong": 32,
              "overall_accuracy": 0.2558139534883721,
              "average_time": 2.280768250310144,
              "difficulty_performance": {
                "Easy": {
                  "accuracy": 0.2558139534883721,
                  "average_time": 2.280768250310144,
                  "total_questions": 43
                }
              },
              "challenging_questions": [
                {
                  "question": "Which of the following is a machine learning library?",
                  "accuracy": 0.0,
                  "average_time": 0.5537697672843933,
                  "attempts": 4
                },
                {
                  "question": "Which of the following is an example of supervised learning?",
                  "accuracy": 0.0,
                  "average_time": 0.6478131294250489,
                  "attempts": 5
                },
                {
                  "question": "Which algorithm is used for classification?",
                  "accuracy": 0.0,
                  "average_time": 0.7834178805351257,
                  "attempts": 4
                }
              ],
              "wrong_answers": [
                {
                  "question": "What is overfitting in machine learning?",
                  "user_answer": "D",
                  "correct_answer": "A",
                  "options": {
                    "A": "When the model performs well on training data but poorly on test data",
                    "B": "When the model performs well on both training and test data",
                    "C": "When the model performs poorly on both training and test data",
                    "D": "When the model performs poorly on training data but well on test data"
                  },
                  "difficulty": "Easy",
                  "time_taken": 1.547417163848877
                },
                {
                  "question": "Which evaluation metric is commonly used for classification tasks?",
                  "user_answer": "D",
                  "correct_answer": "B",
                  "options": {
                    "A": "Mean Squared Error",
                    "B": "Accuracy",
                    "C": "R-Squared",
                    "D": "Silhouette Score"
                  },
                  "difficulty": "Easy",
                  "time_taken": 0.952620267868042
                },
                {
                  "question": "Which of the following is a machine learning library?",
                  "user_answer": "A",
                  "correct_answer": "B",
                  "options": {
                    "A": "NumPy",
                    "B": "TensorFlow",
                    "C": "Matplotlib",
                    "D": "Jupyter"
                  },
                  "difficulty": "Easy",
                  "time_taken": 0.537888765335083
                }
              ]
            }
          }
        }
      },
      "amitpatel@gmail.com": {
        "username": "amit123",
        "createdAt": "2024-02-10T09:22:56Z",
        "updatedAt": "2024-10-19T10:15:00Z",
        "tests": {
          "test789": {
            "type": "report",
            "data": {
              "total_questions": 50,
              "total_correct": 30,
              "total_wrong": 20,
              "overall_accuracy": 0.6,
              "average_time": 1.9348958730702405,
              "difficulty_performance": {
                "Medium": {
                  "accuracy": 0.5,
                  "average_time": 2.1309982318878174,
                  "total_questions": 20
                }
              },
              "challenging_questions": [
                {
                  "question": "What is a decision tree?",
                  "accuracy": 0.0,
                  "average_time": 0.8321676254272461,
                  "attempts": 2
                },
                {
                  "question": "What is the purpose of cross-validation?",
                  "accuracy": 0.5,
                  "average_time": 0.7923455238342285,
                  "attempts": 1
                }
              ],
              "wrong_answers": [
                {
                  "question": "Which of the following is used in clustering?",
                  "user_answer": "A",
                  "correct_answer": "C",
                  "options": {
                    "A": "Linear Regression",
                    "B": "Logistic Regression",
                    "C": "K-Means",
                    "D": "Decision Trees"
                  },
                  "difficulty": "Medium",
                  "time_taken": 0.8725206851959229
                },
                {
                  "question": "What does 'precision' refer to in classification?",
                  "user_answer": "D",
                  "correct_answer": "A",
                  "options": {
                    "A": "True Positives / (True Positives + False Positives)",
                    "B": "True Positives / (True Positives + False Negatives)",
                    "C": "True Negatives / (True Negatives + False Positives)",
                    "D": "All of the above"
                  },
                  "difficulty": "Medium",
                  "time_taken": 1.1323485374450684
                }
              ]
            }
          }
        }
      },
      "snehamishra@gmail.com": {
        "username": "sneha456",
        "createdAt": "2024-03-11T11:23:45Z",
        "updatedAt": "2024-10-18T09:12:00Z",
        "tests": {
          "test123": {
            "type": "report",
            "data": {
              "total_questions": 40,
              "total_correct": 16,
              "total_wrong": 24,
              "overall_accuracy": 0.4,
              "average_time": 2.105673313140869,
              "difficulty_performance": {
                "Hard": {
                  "accuracy": 0.25,
                  "average_time": 2.6532187461853027,
                  "total_questions": 8
                }
              },
              "challenging_questions": [
                {
                  "question": "How is regularization applied in machine learning?",
                  "accuracy": 0.0,
                  "average_time": 1.015320062637329,
                  "attempts": 2
                },
                {
                  "question": "What is an activation function in neural networks?",
                  "accuracy": 0.5,
                  "average_time": 0.8134828805923462,
                  "attempts": 1
                }
              ],
              "wrong_answers": [
                {
                  "question": "Which type of neural network is used for image processing?",
                  "user_answer": "A",
                  "correct_answer": "C",
                  "options": {
                    "A": "Recurrent Neural Network",
                    "B": "Feedforward Neural Network",
                    "C": "Convolutional Neural Network",
                    "D": "Generative Adversarial Network"
                  },
                  "difficulty": "Hard",
                  "time_taken": 1.48765230178833
                },
                {
                  "question": "Which of the following describes gradient descent?",
                  "user_answer": "D",
                  "correct_answer": "A",
                  "options": {
                    "A": "A method to minimize a loss function by adjusting weights iteratively",
                    "B": "A method to maximize a loss function",
                    "C": "A method for clustering data",
                    "D": "A method for classifying data"
                  },
                  "difficulty": "Hard",
                  "time_taken": 2.1534323692321777
                }
              ]
            }
          }
        }
      },
      "rahulsharma@gmail.com": {
        "username": "rahul789",
        "createdAt": "2024-04-05T10:30:00Z",
        "updatedAt": "2024-10-17T12:10:00Z",
        "tests": {
          "test321": {
            "type": "report",
            "data": {
              "total_questions": 35,
              "total_correct": 20,
              "total_wrong": 15,
              "overall_accuracy": 0.5714285714285714,
              "average_time": 1.78965425491333,
              "difficulty_performance": {
                "Medium": {
                  "accuracy": 0.7,
                  "average_time": 1.9213451147079468,
                  "total_questions": 10
                }
              },
              "challenging_questions": [
                {
                  "question": "What is a confusion matrix?",
                  "accuracy": 0.0,
                  "average_time": 0.7124335765838623,
                  "attempts": 3
                },
                {
                  "question": "What is the role of a kernel in SVM?",
                  "accuracy": 0.3,
                  "average_time": 0.9812347888946533,
                  "attempts": 2
                }
              ],
              "wrong_answers": [
                {
                  "question": "Which of the following is used to evaluate clustering algorithms?",
                  "user_answer": "D",
                  "correct_answer": "B",
                  "options": {
                    "A": "Accuracy",
                    "B": "Silhouette Score",
                    "C": "Precision",
                    "D": "Recall"
                  },
                  "difficulty": "Medium",
                  "time_taken": 1.1738431453704834
                },
                {
                  "question": "Which of the following best describes a generative model?",
                  "user_answer": "C",
                  "correct_answer": "A",
                  "options": {
                    "A": "A model that can generate new data samples",
                    "B": "A model that discriminates between different classes",
                    "C": "A model that clusters data",
                    "D": "None of the above"
                  },
                  "difficulty": "Medium",
                  "time_taken": 1.0472397804260254
                }
              ]
            }
          }
        }
      }
    }
  }
  

const App: React.FC = () => {
  return (
    <div className="app">
      <InstructorDashboard users={userData.users} />
    </div>
  );
};

export default App;