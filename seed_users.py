import requests
import random
import time

API_URL = "http://localhost:8085"

names = ["Alex", "Jordan", "Taylor", "Casey", "Morgan", "Riley", "Cameron", "Quinn", "Avery", "Skyler", "Charlie", "Sam", "Jamie", "Drew", "Jesse", "Ali", "Kai", "Rowan", "Hayden", "Finley"]
last_names = ["Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson"]
interests = ['Full-Stack', 'Front-End', 'Back-End', 'Cyber-Security', 'Vibe Coding', 'Open Source', 'Linux']
looking_for = ['Co-Founder', 'Pair-Programmer', 'Reviewer', 'Teammate']
genders = ['male', 'female', 'other']
locations = [
    {"name": "San Francisco", "lat": 37.7749, "lng": -122.4194},
    {"name": "New York", "lat": 40.7128, "lng": -74.0060},
    {"name": "London", "lat": 51.5074, "lng": -0.1278},
    {"name": "Berlin", "lat": 52.5200, "lng": 13.4050},
    {"name": "Tallinn", "lat": 59.4370, "lng": 24.7536},
    {"name": "Tokyo", "lat": 35.6762, "lng": 139.6503},
    {"name": "Toronto", "lat": 43.6510, "lng": -79.3470},
    {"name": "Austin", "lat": 30.2672, "lng": -97.7431},
    {"name": "Seattle", "lat": 47.6062, "lng": -122.3321},
    {"name": "Amsterdam", "lat": 52.3676, "lng": 4.9041}
]

bios = [
    "Just a dev looking for cool projects.",
    "I love writing clean code and drinking coffee.",
    "Building the next big thing. Want to join?",
    "Open source contributor by night, corporate drone by day.",
    "Seeking a co-founder for a SaaS idea.",
    "Vibe coding is my passion.",
    "Let's build something awesome together.",
    "Always learning, always coding.",
    "Linux enthusiast and privacy advocate.",
    "Frontend wizard looking for a backend master."
]

prompts = [
    {"q": "A tech hot take:", "a": ["JavaScript is actually fine.", "C++ is easier than Rust.", "NoSQL is usually a mistake.", "PHP is having a comeback."]},
    {"q": "My ideal hackathon project:", "a": ["Something that uses zero dependencies.", "A CLI tool for personal finance.", "An AI that writes better Jira tickets.", "A game made entirely in CSS."]},
    {"q": "Tabs or spaces?", "a": ["Tabs (obviously).", "Spaces (I'm a professional).", "Whatever the linter says.", "I use both to confuse people."]},
    {"q": "My favorite dev tool:", "a": ["Vim (and I know how to quit).", "The 'Network' tab in Chrome.", "ChatGPT (my pair programmer).", "Postman.", "A rubber duck."]}
]

def generate_user(index):
    first = random.choice(names)
    last = random.choice(last_names)
    nickname = f"{first}{last}{index}"
    email = f"{nickname.lower()}@example.com"
    password = "password123"
    
    # Register
    try:
        res = requests.post(f"{API_URL}/register", json={
            "email": email,
            "password": password,
            "repeatPassword": password
        }, timeout=5)
    except Exception as e:
        print(f"Error connecting to backend: {e}")
        return
    
    if res.status_code not in (200, 201):
        # Maybe user already exists, let's try to login
        res = requests.post(f"{API_URL}/login", json={
            "email": email,
            "password": password
        }, timeout=5)
        if res.status_code != 200:
            print(f"Failed to register/login {email}: {res.status_code}")
            return
        
    token = res.json().get("token")
    headers = {"Authorization": f"Bearer {token}"}
    
    loc = random.choice(locations)
    
    # Pick random prompts
    selected_prompts = random.sample(prompts, 3)
    
    profile_data = {
        "nickname": nickname,
        "age": random.randint(18, 55),
        "gender": random.choice(genders),
        "bio": random.choice(bios),
        "location": loc["name"],
        "latitude": loc["lat"] + random.uniform(-0.1, 0.1),
        "longitude": loc["lng"] + random.uniform(-0.1, 0.1),
        "radius": random.randint(10, 100),
        "interest": random.sample(interests, random.randint(1, 4)),
        "lookingFor": random.sample(looking_for, random.randint(1, 3)),
        "prompt1": selected_prompts[0]["q"],
        "answer1": random.choice(selected_prompts[0]["a"]),
        "prompt2": selected_prompts[1]["q"],
        "answer2": random.choice(selected_prompts[1]["a"]),
        "prompt3": selected_prompts[2]["q"],
        "answer3": random.choice(selected_prompts[2]["a"])
    }
    
    res = requests.patch(f"{API_URL}/me/editProfile", json=profile_data, headers=headers)
    if res.status_code == 200:
        print(f"Updated user {index}: {nickname}")
    else:
        print(f"Failed to update profile for {nickname}: {res.text}")

print("Seeding/Updating users with full profile data...")
# Update the 100 users we just created (indices 200-300)
for i in range(200, 300):
    generate_user(i)
    time.sleep(0.02)
print("Done.")
