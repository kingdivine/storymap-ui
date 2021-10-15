export interface Notification {
  id: string;
  recipient_id: string;
  creator_id: string;
  creator_username: string;
  created_at: Date;
  is_read: boolean;
  action_type: "like" | "comment";
  target_type: "story" | "comment";
  target_id: string;
  comment_id?: string; //TODO: Change field in db to "new_comment_id"
  target_story_title?: string;
  target_story_slug: string;
  target_comment_content?: string;
}
