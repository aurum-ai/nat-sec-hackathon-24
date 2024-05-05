#!/bin/python3

from app import App
import time
from threading import Timer, Thread, Lock, Event
import cv2
from flask import Flask, request, jsonify
import os
import base64
import requests
import io
import json
from openai import OpenAI
from PIL import Image
from tqdm import tqdm
from multiprocessing import Pool, cpu_count
from typing import Dict, Tuple
from dotenv import load_dotenv
import numpy as np
from datetime import datetime


from util import ThreadSafeArray, ThreadSafeThumbnailArray, Thumbnail

load_dotenv()

app = Flask(__name__)

client = OpenAI(
    base_url="https://hackathon.radiantai.com/aurum/openai",
    api_key=f"{os.environ['RADIANT_API_KEY']}",
)

stop_event = Event()

thumbnail_array = ThreadSafeThumbnailArray()
CLASSES = [
    {"id": 0, "description": "russian tank"},
    {"id": 1, "description": "american tank"},
    {"id": 2, "description": "russian soldier"},
    {"id": 3, "description": "american soldier"},
    {"id": 4, "description": "drone"},
    {"id": 5, "description": "explosion"},
    {"id": 6, "description": "smoke"},
    {"id": 7, "description": "fire"},
]
triggers = ThreadSafeArray(CLASSES)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/triggers")
def get_triggers():
    return jsonify({"triggers": triggers.get()})


@app.route("/triggers/add", methods=["POST"])
def add_trigger():
    data = request.get_json()
    triggers.add(data)
    return jsonify({"success": True}), 200


@app.route("/triggers/remove", methods=["POST"])
def remove_trigger():
    data = request.get_json()
    for trigger in triggers[:]:
        if trigger["id"] == data["triggerId"]:
            triggers.remove(trigger)
            break
    return jsonify({"success": True}), 200


def generate_alerts_json(thumbnail_array):
    thumbnails = thumbnail_array.get_thumbnails()
    alerts = []
    for idx, thumbnail in enumerate(thumbnails, start=1):
        alerts.append(
            {
                "id": idx,
                "time": thumbnail.datetime,
                "feed_id": thumbnail.feed_id,
                "type": thumbnail.classes,
                "thumbnail": f"data:image/jpeg;base64,{pil_to_base64_jpg(thumbnail.image)}",
            }
        )
    return json.dumps({"alerts": alerts}, indent=4)


@app.route("/alerts")
def get_alerts():
    return generate_alerts_json(thumbnail_array)


@app.route("/feeds")
def get_feeds():
    return {
        "feeds": [
            {
                "id": 1,
                "name": "drone_1",
                "coordinates": {"latitude": 37.8247422, "longitude": -122.4261617},
            },
            {
                "id": 2,
                "name": "drone_2",
                "coordinates": {"latitude": 37.7742883, "longitude": -122.4604812},
            },
            {
                "id": 3,
                "name": "cctv_1",
                "coordinates": {"latitude": 37.7906386, "longitude": -122.390079},
            },
            {
                "id": 4,
                "name": "ground_1",
                "coordinates": {"latitude": 37.7951755, "longitude": -122.4229226},
            },
            {
                "id": 5,
                "name": "gound_2",
                "coordinates": {"latitude": 37.7934184, "longitude": -122.4561935},
            },
        ]
    }


def encode_image(image_path: str) -> str:
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode("utf-8")


def pil_to_base64_jpg(image: Image) -> str:
    output_buffer = io.BytesIO()
    image.save(output_buffer, format="JPEG")
    image_bytes = output_buffer.getvalue()
    return base64.b64encode(image_bytes).decode("utf-8")


def cv2_to_pil(frame: np.ndarray) -> Image:
    return Image.frombytes(
        "RGB",
        (frame.shape[1], frame.shape[0]),
        cv2.cvtColor(frame, cv2.COLOR_BGR2RGB).tobytes(),
    )


def resize_image_maintain_aspect(image: Image, target_width: int) -> Image:
    target_height = int(image.height * (target_width / image.width))
    # Resize the image while maintaining the aspect ratio
    return image.resize((target_width, target_height))


def analyze_frame_for_classes(frame: Image):
    model = "gpt-4-turbo"
    prompt = f"""
        Identify if an object from the following categories appears in this photo: {triggers.str()}
        Format the json with true/false for each class.
    """
    base64_jpg = pil_to_base64_jpg(frame)

    response = client.chat.completions.create(
        model=model,
        messages=[
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {
                        "type": "image_url",
                        "image_url": {"url": f"data:image/jpeg;base64,{base64_jpg}"},
                    },
                ],
            }
        ],
        response_format={"type": "json_object"},
        max_tokens=300,
    )

    return json.loads(response.choices[0].message.content)


def query_frame_for_classes(feed_id: int, frame_num: int, frame: np.ndarray):
    image = cv2_to_pil(frame)
    image = resize_image_maintain_aspect(image, 512)

    print(f"{feed_id} Querying frame {frame_num} at time {time.time()}")
    result = analyze_frame_for_classes(image)
    print(f"{feed_id} Result of frame {frame_num}: {result}")
    thumbnail_array.add_thumbnail(Thumbnail(feed_id, frame_num, image, result))
    print(thumbnail_array)


def process_frame(feed_id: int, frame_num: int, frame: np.ndarray):
    """Processes each frame, used for live feed"""
    # print(f"{feed_id} Processing frame {frame_num} at time {time.time()}")
    pass


def run_periodically(feed_id: int, path: str):
    cap = cv2.VideoCapture(path)
    if not cap.isOpened():
        print("Cannot open video")
        exit(-1)

    print(f"Opened feed {feed_id} from file {path}")
    current_frame = 0
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
    fps = cap.get(cv2.CAP_PROP_FPS)
    interval = 1.0 / fps

    time_between_analysis_s = 5.0
    last_time_analyzed = 0.0

    print(f"total_frames: {total_frames}, fps: {fps}")

    last_processed_time = 0.0

    while not stop_event.is_set():
        if last_processed_time == 0.0:
            last_processed_time = time.time()
        if last_time_analyzed == 0.0:
            last_time_analyzed = time.time()
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
        # kick off a new thread to process the frame
        t = Thread(target=process_frame, args=(feed_id, current_frame, frame))
        t2 = None

        # kick off a new thread to analyze the frame
        if time_now - last_time_analyzed > time_between_analysis_s:
            last_time_analyzed = time_now
            t2 = Thread(
                target=query_frame_for_classes, args=(feed_id, current_frame, frame)
            )

        t.start()
        if t2 is not None:
            t2.start()
        time_elapsed = time.time() - start_time
        time.sleep(max(0, interval - time_elapsed))


def run_app():
    app.run(debug=True, use_reloader=False)


if __name__ == "__main__":
    flask_thread = None
    video_threads = []
    try:
        flask_thread = Thread(target=run_app)
        flask_thread.start()
        for id, path in enumerate(
            ["test-data/russian-bmp2.mp4", "test-data/russian-bmp2.mp4"]
        ):
            t = Thread(target=run_periodically, args=(id, path))
            video_threads.append(t)
            t.start()

    except KeyboardInterrupt:
        print("Program interrupted, press ctrl-c again to exit")
        stop_event.set()

    finally:
        if flask_thread is not None:
            flask_thread.join()
        for t in video_threads:
            t.join()
