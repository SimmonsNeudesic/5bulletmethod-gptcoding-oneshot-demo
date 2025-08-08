const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

// Get the database path
const dbPath = path.join(__dirname, 'bullet_journal.db');
const schemaPath = path.join(__dirname, 'schema.sql');

// Initialize database
function initializeDatabase() {
    console.log('Initializing database...');
    
    // Create database
    const db = new Database(dbPath);
    
    // Read and execute schema
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema);
    
    // Insert sample data for testing
    insertSampleData(db);
    
    db.close();
    console.log('Database initialized successfully!');
}

function insertSampleData(db) {
    console.log('Inserting sample data...');
    
    // Insert sample bullet entry for last week
    const lastWeekStart = getWeekStart(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000));
    const lastWeekEntry = db.prepare(`
        INSERT INTO bullet_entries (user_id, week_start_date) 
        VALUES (?, ?)
    `).run('test-user', lastWeekStart);
    
    // Insert bullet items for last week
    const lastWeekItems = [
        { emoji: '⚖️', text: 'Lost 5 pounds', category: 'health' },
        { emoji: '🚗', text: 'Got oil change', category: 'car' },
        { emoji: '💅', text: 'Nails done', category: 'health' },
        { emoji: '☎️', text: 'Called mom', category: 'relationships' }
    ];
    
    const insertItem = db.prepare(`
        INSERT INTO bullet_items (bullet_entry_id, order_index, emoji, text, category)
        VALUES (?, ?, ?, ?, ?)
    `);
    
    lastWeekItems.forEach((item, index) => {
        insertItem.run(lastWeekEntry.lastInsertRowid, index, item.emoji, item.text, item.category);
    });
    
    // Insert AI insight for last week
    db.prepare(`
        INSERT INTO ai_insights (bullet_entry_id, insight_text)
        VALUES (?, ?)
    `).run(lastWeekEntry.lastInsertRowid, "Great progress on health and relationships! You're staying balanced across life areas!");
    
    // Insert sample bullet entry for this week
    const thisWeekStart = getWeekStart(new Date());
    const thisWeekEntry = db.prepare(`
        INSERT INTO bullet_entries (user_id, week_start_date) 
        VALUES (?, ?)
    `).run('test-user', thisWeekStart);
    
    // Insert bullet items for this week
    const thisWeekItems = [
        { emoji: '📚', text: 'Read 2 chapters', category: 'learning' },
        { emoji: '🏃', text: 'Ran 3 miles', category: 'health' },
        { emoji: '🎶', text: 'Went to Karaoke', category: 'social' }
    ];
    
    thisWeekItems.forEach((item, index) => {
        insertItem.run(thisWeekEntry.lastInsertRowid, index, item.emoji, item.text, item.category);
    });
}

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day; // Get Monday of the week
    const monday = new Date(d.setDate(diff));
    return monday.toISOString().split('T')[0];
}

// Run initialization if this file is executed directly
if (require.main === module) {
    initializeDatabase();
}

module.exports = { initializeDatabase, getWeekStart };
