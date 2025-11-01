/*
  # Create RPC Functions for Counters

  ## Functions
    - increment_comment_likes: Increment likes_count on comments
    - decrement_comment_likes: Decrement likes_count on comments
    - increment_comment_replies: Increment replies_count on comments
    - increment_post_comments: Increment comments_count on posts
*/

-- Increment comment likes
CREATE OR REPLACE FUNCTION increment_comment_likes(comment_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE comments
  SET likes_count = likes_count + 1
  WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Decrement comment likes
CREATE OR REPLACE FUNCTION decrement_comment_likes(comment_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE comments
  SET likes_count = GREATEST(likes_count - 1, 0)
  WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment comment replies
CREATE OR REPLACE FUNCTION increment_comment_replies(comment_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE comments
  SET replies_count = replies_count + 1
  WHERE id = comment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Increment post comments
CREATE OR REPLACE FUNCTION increment_post_comments(post_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE posts
  SET comments_count = comments_count + 1
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
