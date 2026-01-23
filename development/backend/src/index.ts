//this is a sample index file
//this file contains the configuration of your backend code
//this is where the initiliazation and testing of databse connection takes place
//this starts the server using DI


import 'reflect-metadata'; // MUST be first import
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Agency imports
import { createAgencyRoutes } from './presentation/routes/agency/agencyRoutes';
import { container } from './di/container';
import { TYPES } from './di/types';
import { DatabaseService } from './data/data-sources/DatabaseService';
import { AgencyController } from './presentation/controllers/agency/AgencyController';

// Auth imports
import { AuthController } from './presentation/controllers/auth/AuthController';
import { createAuthRoutes } from './presentation/routes/auth/authRoutes';

// Load environment variables
dotenv.config();

// Error handling
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Promise Rejection:', reason);
  process.exit(1);
});

const corsOptions = {
  origin: ['http://localhost:3000', 'https://yourdomain.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

const app = express();
app.use(cors(corsOptions));

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 8080;
const HOST: string = process.env.HOST || '0.0.0.0';

// Ensure JWT_SECRET is set
if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not set in your .env file. Using a default, insecure key.');
  console.warn('Please set JWT_SECRET in your .env for security.');
}

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.path}, Content-Type: ${req.headers['content-type']}`);
  next();
});

// Middleware
app.use(express.json()); // For parsing JSON request bodies

// Basic health check route
app.get('/', (req, res) => {
  res.send('Node.js TypeScript Agency Backend is running!');
});

// Track if routes are initialized
let routesInitialized = false;

// Initialize routes function
const initializeRoutes = async () => {
  if (routesInitialized) {
    console.log('Routes already initialized, skipping...');
    return app;
  }

  try {
    // Get controller from DI container
    const agencyController = container.get<AgencyController>(TYPES.AgencyController);
    const authController = container.get<AuthController>(TYPES.AuthController);
    
    // Auth Routes (before other routes)
    app.use('/api/auth', createAuthRoutes(authController));
    
    // Routes
    app.use('/api/agencies', createAgencyRoutes(agencyController));
    
    routesInitialized = true;
    console.log('Routes initialized successfully');
    return app;
  } catch (error) {
    console.error('Failed to initialize routes:', error);
    throw error;
  }
};

// Start the server using DI (only in non-test environment)
if (process.env.NODE_ENV !== 'test') {
  const startServer = async () => {
    try {
      await initializeRoutes();
      
      app.listen(PORT, HOST, () => {
        console.log(`Server is running on port ${PORT}`);
        console.log(`Access it at: http://${HOST}:${PORT}`);
        console.log(`JWT Secret loaded: ${process.env.JWT_SECRET ? 'Yes' : 'No (using default)'}`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };
  
  startServer();
}

export { app, initializeRoutes };