from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import openai
import os
from werkzeug.utils import secure_filename
import PyPDF2
import json
from questiongeneration import question_generation
from youtubevideo import fetch_top_youtube_embed_link_combined

app = Flask(__name__)
CORS(app)


UPLOAD_FOLDER = 'uploads/'

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Allowed extensions
ALLOWED_EXTENSIONS = {'pdf', 'txt'}

# Ensure the upload folder exists
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Function to extract text from PDF (optional)
def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ""
        for page_num in range(len(reader.pages)):
            text += reader.pages[page_num].extract_text()
        return text


@app.route('/upload', methods=['POST'])
def upload_file_and_generate_questions():
    # Check if the post request has the file part
    if 'file' not in request.files:
        return jsonify({'message': 'No file part in the request'}), 400

    file = request.files['file']

    # If no file is selected
    if file.filename == '':
        return jsonify({'message': 'No selected file'}), 400

    # If the file is allowed, save it
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)

        # Extract the text from the file (supporting both PDF and text files)
        if filename.endswith('.pdf'):
            text = extract_text_from_pdf(file_path)
        elif filename.endswith('.txt'):
            with open(file_path, 'r') as f:
                text = f.read()
        else:
            return jsonify({'message': 'Unsupported file type'}), 400
    question_generation(text)    
    return jsonify({
            'message': 'File uploaded and processed successfully'
        }), 200
   
@app.route('/get_embed_link', methods=['POST'])
def get_embed_link():
    try:
        # Get the JSON data from the request
        data = request.get_json()

        # Extract the list of keywords from the data
        keywords = data.get('keywords', [])
        if not keywords or not isinstance(keywords, list):
            return jsonify({"error": "Invalid input, 'keywords' must be a non-empty list."}), 400

        # Call the function to fetch the top YouTube embed link
        embed_link = fetch_top_youtube_embed_link_combined(keywords)

        # Return the result
        if embed_link:
            return jsonify({"embed_link": embed_link}), 200
        else:
            return jsonify({"message": "No video found for the given keywords"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500
if __name__ == '__main__':
    app.run(debug=True)        