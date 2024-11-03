CREATE OR REPLACE FUNCTION record_phrase_seen(
    p_user_id UUID,
    p_phrase_text TEXT
)
RETURNS void AS $$
BEGIN
    INSERT INTO public.user_phrases (user_id, phrase_text, times_seen, last_seen)
    VALUES (p_user_id, p_phrase_text, 1, NOW())
    ON CONFLICT (user_id, phrase_text)
    DO UPDATE SET
        times_seen = public.user_phrases.times_seen + 1,
        last_seen = NOW();
END;
$$ LANGUAGE plpgsql;
