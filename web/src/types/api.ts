export interface BulletItem {
  id?: number;
  bullet_entry_id?: number;
  order_index: number;
  emoji: string;
  text: string;
  category?: string;
  created_at?: string;
}

export interface BulletEntry {
  id: number;
  user_id: string;
  week_start_date: string;
  created_at: string;
  updated_at: string;
  items: BulletItem[];
  insight?: AIInsight;
}

export interface AIInsight {
  id: number;
  bullet_entry_id: number;
  insight_text: string;
  generated_at: string;
}

export interface CreateEntryRequest {
  week_start_date: string;
  items: Omit<BulletItem, 'id' | 'bullet_entry_id' | 'created_at'>[];
}

export interface UpdateEntryRequest {
  items: Omit<BulletItem, 'id' | 'bullet_entry_id' | 'created_at'>[];
}

export interface StreakResponse {
  streak: number;
}
