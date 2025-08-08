# 5BulletMethod MVP

This is an educational repo about a weekly productivity journaling app where users log 5 bullet-point accomplishments each week.
# Branches

Each branch in this repository is named after an AI model that was used to "one-shot" the creation of the app. This means that the app was generated in a single pass using the capabilities of the respective model.

Current branches:

- `sonnet-4`
- `gpt-5`
- `gpt-4.1`
- `gemini-2.5-pro`
- `gpt-4o`

Each branch contains the code and artifacts produced by its corresponding model, providing a comparison of how different models approach the same app generation task.

## About the App it Makes

This app was my idea for a fun way to track productivity. It came about after Elon Musk stated the Department of Government Efficiency (DOGE) and asked everyone in the federal government to "report what they did last week. This can be simple, just use a bullet list with 5 things in it that you got done"

Here are some features the app should have:

- **Weekly Entries**: Create one entry per week with up to 5 bullet items
- **Bullet Items**: Each item includes emoji, description, and optional category
- **History View**: Browse all previous weekly entries
- **Streak Tracker**: Shows consecutive weeks of entries
- **AI Insights**: Motivational feedback after submission

### Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Azure Functions (Node.js + TypeScript)
- **Database**: SQLite (better-sqlite3)
- **Auth**: Simulated (userId = "test-user")

## The prompt to one-shot the app build

The same prompt is used to build the app across each model.

The 

