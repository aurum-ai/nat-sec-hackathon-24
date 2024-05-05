from threading import Timer, Thread, Lock
import time


class Thumbnail:
    def __init__(self, feed_id, frame_num, image, classes):
        self.feed_id = feed_id
        self.frame_num = frame_num
        self.image = image
        self.classes = classes
        self.datetime = time.time()

    def __repr__(self):
        return f"Thumbnail(image, feed_id={self.feed_id}, frame_num={self.frame_num}, classes={self.classes})"


class ThreadSafeThumbnailArray:
    def __init__(self):
        self.lock = Lock()
        self.array = []

    def __repr__(self) -> str:
        return f"ThreadSafeThumbnailArray(num_thumbnails={len(self.array)})"

    def add_thumbnail(self, thumbnail):
        with self.lock:
            self.array.append(thumbnail)

    def get_thumbnails(self):
        with self.lock:
            return list(self.array)

    def clear_thumbnails(self):
        with self.lock:
            self.array = []


class ThreadSafeArray:
    def __init__(self):
        self.lock = Lock()
        self.array = []

    def __init__(self, array):
        self.lock = Lock()
        self.array = array

    def str(self):
        return ", ".join(str(item["description"]) for item in self.array)

    def add(self, item):
        with self.lock:
            self.array.append(item)

    def get(self):
        with self.lock:
            return self.array

    def clear(self):
        with self.lock:
            self.array = []
