import os
import json

dir_path = "backend/eurovision_server/db/"

data = []
for filename in os.listdir(dir_path):
    file_path = os.path.join(dir_path, filename)
    if os.path.isfile(file_path) and filename.endswith(".json"):
        with open(file_path, 'r') as f:
            file_contents = f.read()
            json_data = json.loads(file_contents)
            data.append(list(map(lambda x: {
                "country": x["song"]["country"],
                "points": x["points"]
            }, json_data)))

if len(data) == 0:
    print("No data")
    exit()

ranking = [{"country": e["country"], "points": 0} for e in data[0]]
for d in data:
    for i, e in enumerate(d):
        if e["points"] > 0:
            ranking[i]["points"] += e["points"]

ranking = filter(lambda x: x["points"] > 0, ranking)
ranking = sorted(ranking, key=lambda x: x["points"], reverse=True)

for i, e in enumerate(ranking):
    print(i + 1, e["country"], e["points"])

