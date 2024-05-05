#!/bin/python3

from app import App
import time
from threading import Timer, Thread
import cv2
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

def process_frame(frame_num, frame):
    print(f"Processing frame {frame_num} at time {time.time()}")

def run_periodically():
    cap = cv2.VideoCapture("test-data/russian-bmp2.mp4")
    if not cap.isOpened():
        print("Cannot open video")
        exit(-1)

    current_frame = 0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    interval = 1.0 / fps

    print(f"total_frames: {total_frames}, fps: {fps}")

    last_processed_time = 0.0
    
    while True:
        if last_processed_time == 0.0:
            last_processed_time = time.time()
        time_now = time.time()

        time_elapsed = time_now - last_processed_time
        last_processed_time = time_now
        # move forward number of frames based on time elapsed
        frames_to_move = int(time_elapsed * fps)
        current_frame = (current_frame + frames_to_move) % total_frames

        # Read the frame
        if frames_to_move > 1:
            cap.set(cv2.CAP_PROP_POS_FRAMES, current_frame)
        ret, frame = cap.read()
        if not ret:
            print("Error reading frame")
            break

        start_time = time.time()
        t = Thread(target=process_frame, args=(current_frame,frame))
        t.start()
        time_elapsed = time.time() - start_time
        time.sleep(max(0, interval - time_elapsed))

def run_app():
    app.run(debug=True, use_reloader=False)

if __name__ == '__main__':
    flask_thread = None
    try:
        flask_thread = Thread(target=run_app)
        flask_thread.start()
        run_periodically()
    except KeyboardInterrupt:
        print("Program interrupted.")
    finally:
        if flask_thread is not None:
            flask_thread.join()

