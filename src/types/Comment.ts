export interface Comment {
  id: string;
  author_id: string;
  story_id: string | null;
  parent_comment_id: string | null;
  content: string;
  created_at: string;
  author_username: string;
  liker_ids: string[] | null;
  reply_count: string;
}
