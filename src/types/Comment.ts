export interface Comment {
  id: string;
  author_id: string;
  story_id: string;
  parent_comment_id: any;
  content: string;
  created_at: string;
  author_username: string;
  reply_count: string;
  like_count: string;
}
