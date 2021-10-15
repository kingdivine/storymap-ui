export interface CommentDetail {
  id: string;
  author_id: string;
  parent_comment_id: string | null;
  content: string;
  created_at: Date;
  author_username: string;
  like_count: number;
  story_id: string;
  story_slug: string;
  story_title: string;
  replies: CommentDetail[];
}
