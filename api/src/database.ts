const Database = require('better-sqlite3');
const path = require('path');

interface BulletEntry {
    id: number;
    user_id: string;
    week_start_date: string;
    created_at: string;
    updated_at: string;
}

interface BulletItem {
    id: number;
    bullet_entry_id: number;
    order_index: number;
    emoji: string;
    text: string;
    category?: string;
    created_at: string;
}

interface AIInsight {
    id: number;
    bullet_entry_id: number;
    insight_text: string;
    generated_at: string;
}

interface FullBulletEntry extends BulletEntry {
    items: BulletItem[];
    insight?: AIInsight;
}

export class DatabaseService {
    private db: any;

    constructor() {
        const dbPath = path.join(__dirname, '..', 'db', 'bullet_journal.db');
        this.db = new Database(dbPath);
    }

    // Get week start date (Monday) for any given date
    getWeekStart(date: Date): string {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Sunday
        const monday = new Date(d.setDate(diff));
        return monday.toISOString().split('T')[0];
    }

    // Get all entries for a user
    getEntries(userId: string): FullBulletEntry[] {
        const entries = this.db.prepare(`
            SELECT * FROM bullet_entries 
            WHERE user_id = ? 
            ORDER BY week_start_date DESC
        `).all(userId) as BulletEntry[];

        return entries.map(entry => this.getFullEntry(entry.id));
    }

    // Get a specific entry by ID
    getEntry(entryId: number): FullBulletEntry | null {
        const entry = this.db.prepare(`
            SELECT * FROM bullet_entries WHERE id = ?
        `).get(entryId) as BulletEntry;

        if (!entry) return null;
        return this.getFullEntry(entryId);
    }

    // Get entry for a specific week
    getEntryByWeek(userId: string, weekStart: string): FullBulletEntry | null {
        const entry = this.db.prepare(`
            SELECT * FROM bullet_entries 
            WHERE user_id = ? AND week_start_date = ?
        `).get(userId, weekStart) as BulletEntry;

        if (!entry) return null;
        return this.getFullEntry(entry.id);
    }

    // Create a new entry
    createEntry(userId: string, weekStart: string, items: Omit<BulletItem, 'id' | 'bullet_entry_id' | 'created_at'>[]): FullBulletEntry {
        const insertEntry = this.db.prepare(`
            INSERT INTO bullet_entries (user_id, week_start_date)
            VALUES (?, ?)
        `);

        const insertItem = this.db.prepare(`
            INSERT INTO bullet_items (bullet_entry_id, order_index, emoji, text, category)
            VALUES (?, ?, ?, ?, ?)
        `);

        const insertInsight = this.db.prepare(`
            INSERT INTO ai_insights (bullet_entry_id, insight_text)
            VALUES (?, ?)
        `);

        const transaction = this.db.transaction(() => {
            // Insert entry
            const result = insertEntry.run(userId, weekStart);
            const entryId = result.lastInsertRowid as number;

            // Insert items
            items.forEach((item, index) => {
                insertItem.run(entryId, index, item.emoji, item.text, item.category || null);
            });

            // Generate and insert AI insight
            const insight = this.generateAIInsight(items);
            insertInsight.run(entryId, insight);

            return entryId;
        });

        const entryId = transaction();
        return this.getFullEntry(entryId);
    }

    // Update an existing entry
    updateEntry(entryId: number, items: Omit<BulletItem, 'id' | 'bullet_entry_id' | 'created_at'>[]): FullBulletEntry | null {
        const deleteItems = this.db.prepare(`DELETE FROM bullet_items WHERE bullet_entry_id = ?`);
        const insertItem = this.db.prepare(`
            INSERT INTO bullet_items (bullet_entry_id, order_index, emoji, text, category)
            VALUES (?, ?, ?, ?, ?)
        `);
        const updateInsight = this.db.prepare(`
            UPDATE ai_insights SET insight_text = ?, generated_at = CURRENT_TIMESTAMP 
            WHERE bullet_entry_id = ?
        `);

        const transaction = this.db.transaction(() => {
            // Delete existing items
            deleteItems.run(entryId);

            // Insert new items
            items.forEach((item, index) => {
                insertItem.run(entryId, index, item.emoji, item.text, item.category || null);
            });

            // Update AI insight
            const insight = this.generateAIInsight(items);
            updateInsight.run(insight, entryId);
        });

        transaction();
        return this.getFullEntry(entryId);
    }

    // Delete an entry
    deleteEntry(entryId: number): boolean {
        const result = this.db.prepare(`DELETE FROM bullet_entries WHERE id = ?`).run(entryId);
        return result.changes > 0;
    }

    // Get user's streak
    getStreak(userId: string): number {
        const entries = this.db.prepare(`
            SELECT week_start_date FROM bullet_entries 
            WHERE user_id = ? 
            ORDER BY week_start_date DESC
        `).all(userId) as { week_start_date: string }[];

        if (entries.length === 0) return 0;

        let streak = 0;
        let currentWeek = this.getWeekStart(new Date());

        for (const entry of entries) {
            if (entry.week_start_date === currentWeek) {
                streak++;
                // Go to previous week
                const weekDate = new Date(currentWeek);
                weekDate.setDate(weekDate.getDate() - 7);
                currentWeek = this.getWeekStart(weekDate);
            } else {
                break;
            }
        }

        return streak;
    }

    // Get AI insight for an entry
    getAIInsight(entryId: number): AIInsight | null {
        return this.db.prepare(`
            SELECT * FROM ai_insights WHERE bullet_entry_id = ?
        `).get(entryId) as AIInsight || null;
    }

    private getFullEntry(entryId: number): FullBulletEntry {
        const entry = this.db.prepare(`
            SELECT * FROM bullet_entries WHERE id = ?
        `).get(entryId) as BulletEntry;

        const items = this.db.prepare(`
            SELECT * FROM bullet_items 
            WHERE bullet_entry_id = ? 
            ORDER BY order_index
        `).all(entryId) as BulletItem[];

        const insight = this.db.prepare(`
            SELECT * FROM ai_insights WHERE bullet_entry_id = ?
        `).get(entryId) as AIInsight;

        return {
            ...entry,
            items,
            insight
        };
    }

    private generateAIInsight(items: Omit<BulletItem, 'id' | 'bullet_entry_id' | 'created_at'>[]): string {
        // Simple AI insight generation
        const categories = [...new Set(items.map(item => item.category).filter(Boolean))];
        
        if (categories.length >= 3) {
            return "Excellent! You're staying balanced across multiple life areas. Keep up the great work!";
        } else if (categories.length === 2) {
            return "Good progress! Consider adding accomplishments from other life areas for better balance.";
        } else if (categories.length === 1) {
            return `Great focus on ${categories[0]}! Try diversifying your accomplishments across different areas of life.`;
        } else {
            return "You're making progress! Consider adding categories to track your accomplishments across different life areas.";
        }
    }

    close(): void {
        this.db.close();
    }
}

export default DatabaseService;
