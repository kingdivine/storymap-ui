export interface Notification {
  id: string;
  recipient_id: string;
  creator_id: string;
  created_at: Date;
  is_read: boolean;
  action_type: string;
  target_type: string;
  target_id: string;
  comment_id: string;
}
