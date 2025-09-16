# Enhanced accessibility utilities for web applications
# Improved Python scripts for WCAG compliance

import speech_recognition as sr
from moviepy.editor import VideoFileClip
import os
from pathlib import Path
import logging

# Configure logging for accessibility improvements
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def extract_audio_from_video(video_path: str, audio_output: str) -> bool:
    """
    Extract audio from video file for transcription.
    Returns True if successful, False otherwise.
    """
    try:
        if not os.path.exists(video_path):
            logging.error(f"Video file not found: {video_path}")
            return False
            
        video = VideoFileClip(video_path)
        if video.audio is None:
            logging.warning(f"No audio track found in video: {video_path}")
            return False
            
        # Ensure output directory exists
        Path(audio_output).parent.mkdir(parents=True, exist_ok=True)
        
        video.audio.write_audiofile(audio_output, verbose=False, logger=None)
        video.close()
        logging.info(f"Audio extracted successfully to {audio_output}")
        return True
        
    except Exception as e:
        logging.error(f"Error extracting audio: {e}")
        return False

def transcribe_audio_to_text(audio_path: str, language: str = 'en-US') -> dict:
    """
    Enhanced transcription with better error handling and support for multiple languages.
    Returns dict with success status, text, and confidence if available.
    """
    result = {
        'success': False,
        'text': '',
        'confidence': 0.0,
        'error': None
    }
    
    try:
        if not os.path.exists(audio_path):
            result['error'] = f"Audio file not found: {audio_path}"
            return result
            
        recognizer = sr.Recognizer()
        
        # Adjust for ambient noise
        with sr.AudioFile(audio_path) as source:
            recognizer.adjust_for_ambient_noise(source, duration=0.5)
            audio = recognizer.record(source)
            
        try:
            # Use Google Speech Recognition with language support
            text = recognizer.recognize_google(audio, language=language, show_all=False)
            result['success'] = True
            result['text'] = text
            logging.info(f"Transcription successful: {text[:50]}...")
            
        except sr.UnknownValueError:
            result['error'] = "Could not understand the audio content"
            logging.warning("Audio content could not be understood")
            
        except sr.RequestError as e:
            result['error'] = f"Speech recognition service error: {e}"
            logging.error(f"Speech recognition API error: {e}")
            
    except Exception as e:
        result['error'] = f"Unexpected error during transcription: {e}"
        logging.error(f"Transcription error: {e}")
        
    return result

def generate_captions_file(text: str, output_path: str, format_type: str = 'srt') -> bool:
    """
    Generate caption files in various formats (SRT, VTT).
    """
    try:
        Path(output_path).parent.mkdir(parents=True, exist_ok=True)
        
        if format_type.lower() == 'srt':
            # Simple SRT format - in real implementation, you'd need proper timing
            content = f"""1
00:00:00,000 --> 00:00:10,000
{text}
"""
        elif format_type.lower() == 'vtt':
            # WebVTT format
            content = f"""WEBVTT

00:00.000 --> 00:10.000
{text}
"""
        else:
            logging.error(f"Unsupported caption format: {format_type}")
            return False
            
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(content)
            
        logging.info(f"Caption file created: {output_path}")
        return True
        
    except Exception as e:
        logging.error(f"Error creating caption file: {e}")
        return False