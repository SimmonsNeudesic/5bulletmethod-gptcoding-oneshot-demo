const express = require('express');
const cors = require('cors');
const path = require('path');

// Import our functions
const { entries } = require('./dist/src/entries/index.js');
const { streak } = require('./dist/src/streak/index.js');
const { insight } = require('./dist/src/insight/index.js');

const app = express();
const port = process.env.PORT || 7071;

// Middleware
app.use(cors());
app.use(express.json());

// Mock context for Azure Functions
const createMockContext = () => ({
  log: console.log,
  res: {}
});

// Helper to adapt Azure Function to Express
const adaptFunction = (azureFunction) => {
  return async (req, res) => {
    const context = createMockContext();
    
    // Convert Express request to Azure Functions format
    const azureRequest = {
      method: req.method,
      url: req.url,
      headers: req.headers,
      params: req.params,
      query: req.query,
      json: async () => req.body
    };

    try {
      const result = await azureFunction(azureRequest, context);
      
      // Set status and headers
      res.status(result.status || 200);
      if (result.headers) {
        Object.keys(result.headers).forEach(key => {
          res.set(key, result.headers[key]);
        });
      }
      
      // Send response
      if (result.jsonBody) {
        res.json(result.jsonBody);
      } else {
        res.end();
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};

// Routes
app.all('/api/entries/:id?', adaptFunction(entries));
app.get('/api/streak', adaptFunction(streak));
app.get('/api/entries/:id/insight', adaptFunction(insight));

// Start server
app.listen(port, () => {
  console.log(`🚀 5BulletMethod API running on http://localhost:${port}`);
  console.log('📍 Available endpoints:');
  console.log('  GET    /api/entries');
  console.log('  POST   /api/entries');
  console.log('  GET    /api/entries/:id');
  console.log('  PUT    /api/entries/:id');
  console.log('  DELETE /api/entries/:id');
  console.log('  GET    /api/streak');
  console.log('  GET    /api/entries/:id/insight');
});
