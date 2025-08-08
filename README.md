# 5BulletMethod MVP

A weekly productivity journaling app where users log 5 bullet-point accomplishments each week.

## Features

- **Weekly Entries**: Create one entry per week with up to 5 bullet items
- **Bullet Items**: Each item includes emoji, description, and optional category
- **History View**: Browse all previous weekly entries
- **Streak Tracker**: Shows consecutive weeks of entries
- **AI Insights**: Motivational feedback after submission

## Tech Stack

- **Frontend**: React + Vite + TypeScript + Tailwind CSS
- **Backend**: Azure Functions (Node.js + TypeScript)
- **Database**: SQLite (better-sqlite3)
- **Auth**: Simulated (userId = "test-user")

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm
- Azure Functions Core Tools (for running the API locally)

### Installation

1. **Clone and navigate to the project**
```bash
cd 5bulletmethod
```

2. **Set up the database**
```bash
cd db
npm install better-sqlite3
node init.js
cd ..
```

3. **Set up the API**
```bash
cd api
npm install
npm run build
cd ..
```

4. **Set up the frontend**
```bash
cd web
npm install
cd ..
```

### Running the Application

1. **Start the API server** (in one terminal):
```bash
cd api
npm start
```
This starts the Azure Functions runtime on http://localhost:7071

2. **Start the frontend** (in another terminal):
```bash
cd web
npm run dev
```
This starts the Vite dev server on http://localhost:3000

3. **Open your browser** to http://localhost:3000

## Project Structure

```
/
├── api/          # Azure Functions backend
│   ├── src/
│   │   ├── database.ts      # Database service
│   │   ├── entries/         # Entries CRUD API
│   │   ├── streak/          # Streak tracking API
│   │   └── insight/         # AI insights API
│   ├── host.json
│   ├── package.json
│   └── tsconfig.json
├── web/          # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API client
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
└── db/           # Database setup
    ├── schema.sql           # Database schema
    ├── init.js             # Database initialization
    └── bullet_journal.db   # SQLite database file
```

## API Endpoints

- `GET /api/entries` - Get all entries for user
- `POST /api/entries` - Create new entry
- `GET /api/entries/:id` - Get specific entry
- `PUT /api/entries/:id` - Update entry
- `DELETE /api/entries/:id` - Delete entry
- `GET /api/streak` - Get current streak
- `GET /api/entries/:id/insight` - Get AI insight for entry

## Sample Data

The database is initialized with sample data for testing:
- Previous week entry with 4 bullet items
- Current week entry with 3 bullet items
- AI insights for both entries

## Development Notes

- The app runs entirely locally without requiring Azure deployment
- Authentication is simulated with a hardcoded user ID
- The API includes CORS headers for local development
- The frontend proxies API requests to the Functions runtime

## Next Steps

To convert this MVP to production:

1. **Authentication**: Replace simulated auth with real authentication (Azure AD, Auth0, etc.)
2. **Database**: Migrate from SQLite to Azure SQL Database or CosmosDB
3. **AI**: Integrate real AI service (OpenAI, Azure OpenAI) for insights
4. **Deployment**: Deploy API to Azure Functions and frontend to Azure Static Web Apps
5. **Features**: Add user profiles, data export, analytics, etc.

## Troubleshooting

**API not starting**: Make sure Azure Functions Core Tools is installed
**Frontend not connecting to API**: Check that API is running on port 7071
**Database errors**: Run `node db/init.js` to reinitialize the database
