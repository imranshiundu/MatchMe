-- Seed 3000 diverse posts for MatchMe
DO $$
DECLARE
    user_id_val BIGINT;
    i INTEGER;
    content TEXT;
    post_type TEXT;
    created_at_val TIMESTAMP;
    topics TEXT[] := ARRAY[
        'Just finished a 5km run. Feeling alive! #life #fitness',
        'Does anyone else feel like coffee is the only reason they function? ☕️',
        'Finally moved to a new apartment. The view is amazing!',
        'Anyone into mountain biking? Looking for trails around here.',
        'Just watched the new season of Citadel. 10/10 would recommend.',
        'Trying out a new vegan recipe today. Hope I dont burn the kitchen down lol.',
        'The weekend was too short. Can we just have a 4-day work week already?',
        'Life is not just about code. Spend time with family, people!',
        'Just got a new pair of sneakers. They look so clean 👟',
        'Sunsets are proof that endings can be beautiful too.',
        'Thinking of starting a podcast. What should be the first topic?',
        'Pizza or Tacos? The eternal debate continues.',
        'Road trip planned for next weekend. Suggestions for places to stop?',
        'Just discovered a hidden gem of a cafe downtown. Best croissants ever.',
        'Working on my workspace setup. RGB or minimal?',
        'Anyone else obsessed with mechanical keyboards? The clicky sound is so satisfying.',
        'Just finished reading "The Midnight Library". Life-changing.',
        'Learning a new language (Human language, not programming!). Bonjour!',
        'The sky today looks like a painting.',
        'Manifesting a great week for everyone reading this! ✨',
        'Why is it so hard to find a good pair of jeans?',
        'Just had the best ramen of my life.',
        'Thinking of adopting a cat. Any advice for a first-time owner?',
        'Weekend vibes: Netflix and pizza. 🍕🍿',
        'Exploring the city today. Found so many cool murals!',
        'Who else is excited for the summer?',
        'Just started gyming again. The soreness is real.',
        'Tech is great, but have you tried sitting in a park with no phone?',
        'Finally fixed that bug that was haunting me for 3 days. Victory!',
        'React vs Vue? Let the war begin. Just kidding, use what you like.',
        'System design is hard but rewarding.',
        'TypeScript is the best thing that happened to JS. Change my mind.',
        'Working from a beach today. Digital nomad life is real.',
        'Just joined a local football team. Let s go!',
        'Gaming tonight. Who s in for some Warzone?',
        'The hustle is real, but dont forget to rest.',
        'Anyone want to collab on an Open Source project?',
        'Just deployed my first app to production. Scared and excited!',
        'Minimalism is not about having less, it s about making room for more.',
        'Peace of mind is the ultimate goal.'
    ];
    languages TEXT[] := ARRAY['JAVASCRIPT', 'PYTHON', 'JAVA', 'GO', 'RUST', 'CPP', 'TS'];
    types TEXT[] := ARRAY['TEXT', 'CODE', 'MEDIA'];
BEGIN
    FOR i IN 1..3000 LOOP
        -- Select a random user from existing users (assuming IDs 1 to 504 are mostly present)
        SELECT id INTO user_id_val FROM users OFFSET floor(random() * 504) LIMIT 1;
        
        -- Random content from topics
        content := topics[floor(random() * array_length(topics, 1)) + 1];
        
        -- Random post type
        post_type := types[floor(random() * array_length(types, 1)) + 1];
        
        -- Random timestamp in the last 30 days
        created_at_val := NOW() - (random() * (interval '30 days'));
        
        INSERT INTO posts (content, type, code_language, created_at, author_id, likes_count)
        VALUES (
            content,
            post_type,
            CASE WHEN post_type = 'CODE' THEN languages[floor(random() * array_length(languages, 1)) + 1] ELSE NULL END,
            created_at_val,
            user_id_val,
            floor(random() * 50)
        );
    END LOOP;
END $$;
