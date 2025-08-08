-- 5BulletMethod Database Schema

-- Table for weekly bullet entries
CREATE TABLE bullet_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    week_start_date TEXT NOT NULL, -- ISO date string (YYYY-MM-DD)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, week_start_date)
);

-- Table for individual bullet items within an entry
CREATE TABLE bullet_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bullet_entry_id INTEGER NOT NULL,
    order_index INTEGER NOT NULL,
    emoji TEXT NOT NULL,
    text TEXT NOT NULL,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bullet_entry_id) REFERENCES bullet_entries(id) ON DELETE CASCADE
);

-- Table for AI insights
CREATE TABLE ai_insights (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bullet_entry_id INTEGER NOT NULL,
    insight_text TEXT NOT NULL,
    generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (bullet_entry_id) REFERENCES bullet_entries(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_bullet_entries_user_date ON bullet_entries(user_id, week_start_date);
CREATE INDEX idx_bullet_items_entry ON bullet_items(bullet_entry_id);
CREATE INDEX idx_ai_insights_entry ON ai_insights(bullet_entry_id);
