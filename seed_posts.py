import random
from datetime import datetime, timedelta

def generate_seed_sql():
    users = [
        ("Alex Thompson", "alex@example.com", "Senior Fullstack Engineer. Coffee & Clean Code.", "San Francisco, CA", ["Full-Stack", "React", "Node.js"]),
        ("Sarah Miller", "sarah@example.com", "Frontend Architect | React & TypeScript enthusiast.", "Berlin, Germany", ["Frontend", "TypeScript", "React"]),
        ("Michael Chen", "mike@example.com", "Data Scientist focused on AI/ML. Python & R expert.", "London, UK", ["AI/ML", "Python", "Back-End"]),
        ("Emily Rodriguez", "emily@example.com", "Systems Programmer. Rust is my language of choice.", "Toronto, Canada", ["Rust", "Back-End", "Open Source"]),
        ("Jason Wilson", "jason@example.com", "DevOps Engineer. Automating the world one script at a time.", "Austin, TX", ["DevOps", "Linux", "Docker"]),
        ("Nina Petrov", "nina@example.com", "Cybersecurity Researcher. Ethical hacker & security advocate.", "Tel Aviv, Israel", ["Cyber-Security", "Linux", "Rust"]),
        ("Leo Yamamoto", "leo@example.com", "Backend Specialist. Java/Spring Boot is my jam.", "Tokyo, Japan", ["Back-End", "Java", "PostgreSQL"]),
        ("Clara Dubois", "clara@example.com", "Vibe Coder. Building beautiful things with React & Tailwind.", "Paris, France", ["Vibe Coding", "Frontend", "React"]),
        ("David Smith", "dave@example.com", "Just a dev trying to fix my own bugs.", "Seattle, WA", ["Full-Stack", "JavaScript", "Python"]),
        ("Tina Carlson", "tina@example.com", "CTO & Open Source contributor. Scaling systems.", "Stockholm, Sweden", ["CTO", "Scaling", "Back-End"])
    ]

    posts = [
        "Just refactored a legacy service to use Rust. The memory safety and performance gains are incredible! #RustLang",
        "Why is CSS centering still so difficult in 2026? Just kidding, Flexbox saved us all.",
        "Deep diving into LLMs today. Building a local RAG system with Llama 3. The future is here.",
        "System design tip: Always assume the network will fail. Build for resilience.",
        "React 19 features are looking sharp! Can't wait to use useActionState in production.",
        "Dockerizing everything. My local machine has never been cleaner.",
        "Working on a side project: a decentralized social network for cats. Stay tuned.",
        "Is it just me or is Vibe Coding the most productive way to work?",
        "PostgreSQL is still the king of databases. Change my mind.",
        "Writing clean code is like writing a good book. It should be easy to read and hard to put down.",
        "Automation is not about saving time, it's about consistency. #DevOps",
        "Fixed a bug today that's been haunting me for weeks. It was a typo. Naturally.",
        "Exploring Kubernetes operators. High learning curve but so powerful.",
        "TypeScript is not a choice, it's a lifestyle. Type safety for life!",
        "Building a high-performance API with Go. The simplicity is refreshing.",
        "Cybersecurity is everyone's responsibility. Check your dependencies!",
        "Scaling a startup from 0 to 1M users. Lessons learned: monitor everything.",
        "Just pushed my first open source contribution! Feels great to give back.",
        "Python for data science is just unbeatable. The ecosystem is too good.",
        "Vite is so fast it makes me feel like I'm working in the future."
    ]

    sql_statements = []
    
    # Insert Users
    for i, (nick, email, bio, loc, interests) in enumerate(users):
        user_id = i + 100
        sql_statements.append(
            f"INSERT INTO users (id, email, password, location) VALUES ({user_id}, '{email}', '$2a$10$8.UnVuG9HHgffUDAlk8qnO6p5EWC19S22TKJ1NfW8WB3BvD6eByE2', '{loc}') ON CONFLICT (id) DO NOTHING;"
        )
        sql_statements.append(
            f"INSERT INTO profile (user_id, nickname, bio, image_url, age, gender) VALUES ({user_id}, '{nick}', '{bio}', 'https://api.dicebear.com/7.x/avataaars/svg?seed={nick}', 28, 'Developer') ON CONFLICT (user_id) DO UPDATE SET nickname = EXCLUDED.nickname, bio = EXCLUDED.bio, image_url = EXCLUDED.image_url;"
        )
        for interest in interests:
            sql_statements.append(
                f"INSERT INTO profile_interest (user_id, interest) VALUES ({user_id}, '{interest}') ON CONFLICT DO NOTHING;"
            )

    # Insert Posts
    for i, content in enumerate(posts):
        post_id = i + 100
        author_id = random.randint(100, 100 + len(users) - 1)
        created_at = datetime.now() - timedelta(hours=random.randint(1, 48))
        created_at_str = created_at.strftime('%Y-%m-%d %H:%M:%S')
        escaped_content = content.replace("'", "''")
        sql_statements.append(
            f"INSERT INTO posts (id, content, type, created_at, author_id, user_id, likes_count) VALUES ({post_id}, '{escaped_content}', 'text', '{created_at_str}', {author_id}, {author_id}, 0) ON CONFLICT (id) DO UPDATE SET content = EXCLUDED.content, author_id = EXCLUDED.author_id, user_id = EXCLUDED.user_id;"
        )

    return "\n".join(sql_statements)

if __name__ == "__main__":
    with open("seed_data.sql", "w") as f:
        f.write(generate_seed_sql())
    print("seed_data.sql generated.")
