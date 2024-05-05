from flask import Flask, request, jsonify

app = Flask(__name__)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

triggers = []

@app.route('/triggers')
def get_triggers():
    return jsonify({"triggers": triggers})

@app.route('/triggers/add', methods=['POST'])
def add_trigger():
    data = request.get_json()
    triggers.append(data)
    return jsonify({"success": True}), 200

@app.route('/triggers/remove', methods=['POST'])
def remove_trigger():
    data = request.get_json()
    for trigger in triggers[:]:
        if trigger['id'] == data['triggerId']:
            triggers.remove(trigger)
            break
    return jsonify({"success": True}), 200


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


@app.route("/alerts")
def get_alerts():
    return {
        "alerts": [
            {
                "id": 1,
                "datetime": "2022-01-01T12:00:00Z",
                "feed_id": 1,
                "type": "truck",
                "thumbnail": "",
            },
            {
                "id": 2,
                "datetime": "2022-01-01T12:00:00Z",
                "feed_id": 3,
                "type": "tank",
                "thumbnail": "",
            },
        ]
    }
