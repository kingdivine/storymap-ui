export interface StoryDetail {
  id: string;
  title: string;
  place_name: string;
  slug: string;
  created_at: string;
  geo_json: string;
  content: string;
  is_private: boolean;
  author_name: string;
  author_id: string;
  tags: string[];
  likers: Liker[];
}

interface Liker {
  id: string;
  username: string;
}
