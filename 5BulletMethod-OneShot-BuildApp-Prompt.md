# Building the 5BulletMethod App

Build an MVP for 5BulletMethod, a weekly productivity journaling app where users log 5 bullet-point accomplishments each week.

## 🔧 Tech Stack
Frontend: React with Vite (TypeScript) + Tailwind CSS
Backend: Azure Functions (Node.js + TypeScript)
Database: SQLite (use better-sqlite3, installed via npm)
Auth: Simulated login (userId = "test-user") — real auth will be added later.

## 🎯 Features

1. Weekly Entries: Users can create one entry per week, with up to 5 bullet items. Each includes:
- Emoji
- Short description
- Optional tag or category

Example weekly entry:

```⚖️ Lost 5 pounds [health]  
🚗 Got oil change [car]  
💅 Nails done [health]  
☎️ Called mom [relationships]  
🎶 Went to Karaoke [social]
```

2. History View: See previous weekly entries

3. Streak Tracker: Show how many weeks in a row a user has submitted entries

4. AI Insight (Stub): Return a motivational string after submission. For now, just: "You're staying balanced across life areas!"

## 📁 Folder Layout

```/api      – Azure Functions  
/web      – React + Vite + Tailwind frontend  
/db       – SQLite schema and database file  
```

## 📘 Data Model

BulletEntry: id, user_id, week_start_date, created_at
BulletItem: id, bullet_entry_id, order, emoji, text, category
AIInsight: id, bullet_entry_id, insight_text, generated_at

## 🔗 API Endpoints

POST /entries, GET /entries, GET /entries/:id, PUT, DELETE
GET /streak
GET /entries/:id/insight

## 🧪 Dev Experience

Must run entirely locally without Azure or real auth
Use Axios on frontend for API calls
Include package.json, .env.example, and README
Seed sample data for testing

## 🧠 Agent Instructions (Do Not Skip)

Think and plan sequentially: create schema → backend → frontend → UI polish → test
Use internal tools as needed: generate code, write files, verify output
Do not stop after partial generation — continue until the app is fully functional
Check your own work: Are all pages, functions, and styles complete?
If something is unclear, make your best guess and note where it may need review
Output all code, all files, and final status once complete