// DOST DX Organization Management Backend
// Main entry point for the application
// Initializes database connection and registers API routes

console.log('Starting DX Organization Management Backend...');

import 'reflect-metadata'; // MUST be first import
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { container } from './di/container';
import { TYPES } from './di/types';
import { DatabaseService } from './data/data-sources/DatabaseService';
import { OrganizationalUnitController } from './presentation/controllers/organization/OrganizationalUnitController';
import { createOrganizationalUnitRoutes } from './presentation/routes/organization/OrganizationalUnitRoute';
import { createSuccessResponse, createErrorResponse } from './presentation/models/dto/GlobalResponseDto';
import './config/jwt.config.js'; // Load JWT configuration and display token

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
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://yourdomain.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

const app = express();
app.use(cors(corsOptions));

const PORT: number = process.env.BACKEND_PORT ? parseInt(process.env.BACKEND_PORT) : (process.env.PORT ? parseInt(process.env.PORT) : 8080);
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
  const response = createSuccessResponse(
    {
      service: 'DX Organization Management Backend',
      version: '1.0.0',
      status: 'operational'
    }
  );
  res.json(response);
});

// Test database connection endpoint
app.get('/api/test/db', async (req, res) => {
  try {
    const databaseService = container.get<DatabaseService>(TYPES.DatabaseService);
    const pool = databaseService.getPool();
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    
    const response = createSuccessResponse(
      {
        current_time: result.rows[0].current_time,
        postgres_version: result.rows[0].pg_version
      }
    );
    res.json(response);
  } catch (error) {
    const errorResponse = createErrorResponse(
      'Database connection failed',
      500,
      { error: error instanceof Error ? error.message : 'Unknown error' }
    );
    res.status(500).json(errorResponse);
  }
});

// Track if routes are initialized
let routesInitialized = false;

/**
 * Initialize routes function
 */
const initializeRoutes = async () => {
  if (routesInitialized) {
    console.log('Routes already initialized, skipping...');
    return app;
  }

  try {
    await initializeDatabase();
    registerRoutes();
    routesInitialized = true;
    console.log('Routes initialized successfully');
    return app;
  } catch (error) {
    console.error('Failed to initialize routes:', error);
    throw error;
  }
};

/**
 * Initialize database connection
 */
const initializeDatabase = async (): Promise<void> => {
  const databaseService = container.get<DatabaseService>(TYPES.DatabaseService);
  await databaseService.initialize();
};

/**
 * Register application routes
 */
const registerRoutes = (): void => {
  // Main API route
  app.get('/api', (req, res) => {
    const response = createSuccessResponse(
      {
        version: '1.0.0',
        endpoints: [
          '/api/organizational-units'
        ]
      }
    );
    res.json(response);
  });

  // Organizational Unit Routes
  const organizationalUnitController = container.get<OrganizationalUnitController>(TYPES.OrganizationalUnitController);
  app.use('/api', createOrganizationalUnitRoutes(organizationalUnitController));
};

// For testing: automatically initialize routes when imported
if (process.env.NODE_ENV === 'test') {
  // Initialize routes immediately for tests
  initializeRoutes().catch(error => {
    console.error('Failed to initialize routes for testing:', error);
  });
}

// Start the server using DI (only in non-test environment)
if (process.env.NODE_ENV !== 'test') {
  const startServer = async () => {
    try {
      await initializeRoutes();
      
      app.listen(PORT, HOST, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
        console.log(`📍 Access it at: http://${HOST}:${PORT}`);
        console.log(`🔐 JWT Secret loaded: ${process.env.JWT_SECRET ? 'Yes' : 'No (using default)'}`);
        console.log(`📋 Available endpoints:`);
        console.log(`   - GET  /api/organizational-units`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };
  
  startServer();
}

export { app, initializeRoutes };