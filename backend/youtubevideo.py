from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import os

API_KEY = os.getenv('YOUTUBE_API_KEY')  # Replace this with your actual YouTube API key

def fetch_top_youtube_embed_link_combined(keywords, max_results=1):
    youtube = build("youtube", "v3", developerKey=API_KEY)

    try:
        # Combine all keywords into a single search query
        combined_keywords = " ".join(keywords)

        # Search YouTube for the combined keywords
        search_response = youtube.search().list(
            q=combined_keywords, 
            type="video",
            part="id,snippet",
            maxResults=max_results
        ).execute()

        # Get the first video from the response
        items = search_response.get("items", [])
        if items:
            top_video = items[0]  # Top video is the first item in the list
            video_id = top_video['id']['videoId']  # Extract only the video ID

            # Generate the YouTube embed link
            embed_link = f"https://www.youtube.com/embed/{video_id}"
            return embed_link
        else:
            return None  # No video found for the combined keywords

    except HttpError as e:
        print(f"An HTTP error {e.resp.status} occurred:\n{e.content}")
        return None
