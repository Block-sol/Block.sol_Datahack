from dotenv import load_dotenv

 # take environment variables from .env.

from openai import OpenAI
import json
import os
from PyPDF2 import PdfReader


load_dotenv() 
client = OpenAI(
  api_key=os.getenv('OPENAI_API_KEY'),  # this is also the default, it can be omitted
)

def extract_text_from_pdf(file_path):
    reader = PdfReader(file_path)
    text = []
    for page in reader.pages:
        page_text = page.extract_text()
        if page_text:  # Check if text extraction is not None
            text.append(page_text)
    return "\n".join(text)

def generate_questions(text, number_of_questions):
   

    try:
        # Creating the prompt
        prompt = f'''
Your task is to generate exactly 24 multiple-choice questions based on the provided text. Follow these instructions precisely:

1. Create 8 easy, 8 medium, and 8 hard questions.
2. Format the output as a single, valid JSON array
4. Do not stop generation until all 24 questions are complete.
5. Ensure the JSON is properly formatted and closed.

Do not include any text before or after the JSON array.

Example structure (repeat this 20 times):
      {{
        "difficulty": "Easy",
        "question": "What is overfitting in machine learning?",
        "options": {{
          "A": "When the model performs well on training data but poorly on test data",
          "B": "When the model performs well on both training and test data",
          "C": "When the model performs poorly on both training and test data",
          "D": "When the model performs poorly on training data but well on test data"
        }},
        "related_topics" : ['topic1','topic2','topic3'],
        "related_links" : ['youtube_link','research_paper_link','youtube_link'],
        "correctAnswer": "A"
      }}

Generate questions based on this text:
{text}

Remember:
- Generate exactly 24 questions.
- Maintain an even distribution of difficulties.
- strictly Ensure the JSON is complete and valid wihtout any extrat words.
- Do not stop until all questions are generated.
- compulsory all data should be present.
        '''

# Making the API call
        completion = client.chat.completions.create(
           model="gpt-4o-mini",
              messages=[{"role": "user", "content": prompt}])



# The response can be accessed via response.text
        generated_text = completion.choices[0].message.content
       
        
        # Extracting the response text
        generated_questions =  generated_text
        print(generate_questions)
        return generated_questions

    except Exception as e:
        print(f"An error occurred while generating questions: {str(e)}")
        return []

def extract_and_save_json(input_string, file_name):
    # Step 1: Extract the JSON part from the content
    start_index = input_string.find("```json") + len("```json")
    end_index = input_string.rfind("```")

    # Extract only the JSON string
    json_string = input_string[start_index:end_index].strip()

    # Step 2: Convert the extracted string to JSON
    try:
        json_data = json.loads(json_string)  # Convert the string to a Python dictionary or list
        print(json.dumps(json_data, indent=4))  # Pretty-print the JSON data for readability

        # Save the JSON data to a file
        with open(file_name, 'w') as f:
            json.dump(json_data, f, indent=4)
        print(f"JSON data saved to {file_name}")
        
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")

def question_generation(file_path,file_name):
    try:
        text_content = extract_text_from_pdf(file_path)
        questions = generate_questions(text_content, 30)
        extract_and_save_json(questions,file_name)
        # save_questions(user_id, quiz_name, questions)
        # print('Questions successfully saved to Firestore')
    except Exception as e:
        print(f"An error occurred: {str(e)}")


