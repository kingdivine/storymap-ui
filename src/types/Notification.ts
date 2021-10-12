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
  comment_id: string;
}
