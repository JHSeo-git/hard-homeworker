# See https://huggingface.co/spaces/SteveDigital/free-fast-youtube-url-video-to-text-using-openai-whisper
import whisper
from pytube import YouTube
import gradio as gr
import os
import re
import logging

logging.basicConfig(level=logging.INFO)
model = whisper.load_model("base")

def get_text(url):
    #try:
    if url != '':
        output_text_transcribe = ''

    yt = YouTube(url)
    #video_length = yt.length --- doesn't work anymore - using byte file size of the audio file instead now
    #if video_length < 5400:
    video = yt.streams.filter(only_audio=True).first()
    out_file=video.download(output_path=".")

    file_stats = os.stat(out_file)
    logging.info(f'Size of audio file in Bytes: {file_stats.st_size}')

    if file_stats.st_size <= 30000000:
        base, ext = os.path.splitext(out_file)
        new_file = base+'.mp3'
        os.rename(out_file, new_file)
        a = new_file

        result = model.transcribe(a)
        return result['text'].strip()
    else:
        logging.error('Videos for transcription on this space are limited to about 1.5 hours. Sorry about this limit but some joker thought they could stop this tool from working by transcribing many extremely long videos. Please visit https://steve.digital to contact me about this space.')
    #finally:
    #    raise gr.Error("Exception: There was a problem transcribing the audio.")

def get_summary(article):
    first_sentences = ' '.join(re.split(r'(?<=[.:;])\s', article)[:5])
    b = summarizer(first_sentences, min_length = 20, max_length = 120, do_sample = False)
    b = b[0]['summary_text'].replace(' .', '.').strip()
    return b
