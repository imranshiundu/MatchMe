import psycopg2
import random
from datetime import datetime

# Database connection parameters
DB_PARAMS = {
    "host": "127.0.0.1",
    "port": "5433",
    "database": "matchme",
    "user": "postgres",
    "password": "postgres"
}

def seed_connections():
    try:
        # Connect to the database
        conn = psycopg2.connect(**DB_PARAMS)
        cur = conn.cursor()

        # Fetch all user IDs
        cur.execute("SELECT id FROM users")
        user_ids = [row[0] for row in cur.fetchall()]

        if not user_ids:
            print("No users found in the database.")
            return

        print(f"Found {len(user_ids)} users. Generating connections...")

        # Clear existing connections to start fresh (optional, but good for demo)
        # cur.execute("DELETE FROM connections")

        count = 0
        now = datetime.now()

        # For each user, create 3-8 random connections
        for user_id in user_ids:
            # Pick a random number of people to follow
            targets = random.sample(user_ids, min(random.randint(3, 8), len(user_ids)))
            
            for target_id in targets:
                if user_id == target_id:
                    continue

                # Check if connection already exists in either direction
                cur.execute(
                    "SELECT 1 FROM connections WHERE (requester_id = %s AND receiver_id = %s) OR (requester_id = %s AND receiver_id = %s)",
                    (user_id, target_id, target_id, user_id)
                )
                if cur.fetchone():
                    continue

                # Insert connection
                # We assume there's a sequence or we can use nextval if needed
                # To be safe with Hibernate, we'll use the sequence if it exists
                cur.execute("SELECT nextval('connections_seq')")
                conn_id = cur.fetchone()[0]

                cur.execute(
                    "INSERT INTO connections (id, requester_id, receiver_id, status, created_at, updated_at) VALUES (%s, %s, %s, %s, %s, %s)",
                    (conn_id, user_id, target_id, 'ACCEPTED', now, now)
                )
                count += 1

        conn.commit()
        print(f"Successfully created {count} new connections.")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        if conn:
            cur.close()
            conn.close()

if __name__ == "__main__":
    seed_connections()
