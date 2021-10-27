export interface Comment {
  id: string;
  author_id: string;
  story_id: string | null;
  parent_comment_id: string | null;
  content: string;
  created_at: Date;
  author_username: string;
  author_avatar: string;
  liker_ids: string[];
  reply_count: string;
}
