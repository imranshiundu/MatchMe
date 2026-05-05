DO $$
DECLARE
    u1 RECORD;
    u2 RECORD;
    conn_id BIGINT;
BEGIN
    FOR u1 IN SELECT id FROM users LOOP
        -- For each user, try to follow 5 random other users
        FOR u2 IN (SELECT id FROM users WHERE id <> u1.id ORDER BY RANDOM() LIMIT 5) LOOP
            -- Check if connection already exists
            IF NOT EXISTS (
                SELECT 1 FROM connections 
                WHERE (requester_id = u1.id AND receiver_id = u2.id) 
                   OR (requester_id = u2.id AND receiver_id = u1.id)
            ) THEN
                -- Get next sequence value
                SELECT nextval('connections_seq') INTO conn_id;
                
                -- Insert accepted connection
                INSERT INTO connections (id, requester_id, receiver_id, status, created_at, updated_at)
                VALUES (conn_id, u1.id, u2.id, 'ACCEPTED', NOW(), NOW());
            END IF;
        END LOOP;
    END LOOP;
END $$;
