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

// Database
import { databaseService } from './data/data-sources/databaseService';

// Agency API
import { agencyController } from './presentation/controllers/agency-by-sector/agencyController';
import { createAgencyRoutes } from './presentation/routes/agency-by-sector/agencyRoutes';

// Organization List API
import { organizationalUnitController as OrgListController } from './presentation/controllers/organizational-unit-list/organizationalunitController';
import { createOrganizationalUnitRoutes as createOrgListRoutes } from './presentation/routes/organization-unit-list/organizationalunitRoutes';

// Update Organizational Unit API
import { organizationalUnitController as UpdateOrgController } from './presentation/controllers/update-organizational-unit/organizationalUnitController';
import { createOrganizationalUnitRoutes as createUpdateOrgRoutes } from './presentation/routes/update-organizational-unit/organizationalUnitRoutes';

// Unit Type API
import { UnitTypeController } from './presentation/controllers/unit-type/unitTypeController';
import { EditUnitTypeController } from './presentation/controllers/unit-type/editUnitTypeController';
import { createUnitTypeRoutes } from './presentation/routes/unit-type/unitTypeRoutes';

// User Organizational Unit Access
import { createUserOrgUnitAccessRoutes } from "./presentation/routes/user-org-unit-access/userOrgUnitAccessRoutes";
import { UserOrgUnitAccessController } from "./presentation/controllers/user-org-unit-access/userOrgUnitAccessController";

// Auth
import { authController } from './presentation/controllers/auth/authController';
import { createAuthRoutes } from './presentation/routes/auth/authRoutes';

// Response Models
import { createSuccessResponse, createErrorResponse } from './presentation/models/dto/GlobalResponseDto';

// JWT Configuration
import './config/jwt.config'; // Load JWT configuration and display token

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
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8004', 'https://yourdomain.com'],
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
      status: 'operational',
      apis: ['Agency API', 'Organization API']
    }
  );
  res.json(response);
});

// Test database connection endpoint
app.get('/api/test/db', async (req, res) => {
  try {
    const databaseService = container.get<databaseService>(TYPES.databaseService);
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
 * Registers all API routes in a scalable manner
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
  const databaseService = container.get<databaseService>(TYPES.databaseService);
  await databaseService.initialize();
};

/**
 * Register application routes
 * Modular route registration for scalability
 */
const registerRoutes = (): void => {
  // Main API route - Lists all available endpoints
  app.get('/api', (req, res) => {
    res.json(createSuccessResponse({
      version: '1.0.0',
      endpoints: {
        auth: '/api/auth',
        agencies: '/api/agencies',
        organizationalUnits: '/api/organizational-units',

        userOrgUnitAccess: {
          grant: 'POST /api/user-access',
          upsert: 'PUT /api/user-org-unit-access',
          get: 'GET /api/user-org-unit-access?user_id=123'
        }
      }
    }));
  });

  // ============================================
  // Auth Routes - Must be registered first
  // ============================================
  const authController = container.get<authController>(TYPES.authController);
  app.use('/api/auth', createAuthRoutes(authController));

  // ============================================
  // Agency API Routes
  // ============================================
  const agencyController = container.get<agencyController>(TYPES.agencyController);
  app.use('/api/agencies', createAgencyRoutes(agencyController));

  // ============================================
  // Organization List API Routes
  // ============================================
  const orgListController = container.get<OrgListController>(TYPES.organizationalUnitController);
  app.use('/api', createOrgListRoutes(orgListController));

  // ============================================
  // Update Organizational Unit API Routes
  // ============================================
  const updateOrgController = container.get<UpdateOrgController>(TYPES.UpdateOrganizationalUnitController);
  app.use('/api/organizational-units', createUpdateOrgRoutes(updateOrgController));

  // ============================================
  // Unit Type API Routes
  // ============================================
  const unitTypeController = container.get<UnitTypeController>(TYPES.UnitTypeController);
  const editUnitTypeController = container.get<EditUnitTypeController>(TYPES.EditUnitTypeController);
  app.use('/api', createUnitTypeRoutes(unitTypeController, editUnitTypeController));

  // ============================================
  // User Organizational Unit Access Routes
  // ============================================
  const userAccessController = container.get<UserOrgUnitAccessController>(TYPES.UserOrgUnitAccessController);
  app.use("/api", createUserOrgUnitAccessRoutes(userAccessController));

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
        console.log(`📋 Available APIs:`);
        console.log(`   - Auth:         /api/auth`);
        console.log(`   - Agencies:     /api/agencies/by-sector/list`);
        console.log(`   - Org Units:    /api/organizational-units`);
      });
    } catch (error) {
      console.error('Failed to start server:', error);
      process.exit(1);
    }
  };

  startServer();
}

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Handle invalid JSON (body-parser error)
  if (err instanceof SyntaxError && 'body' in err) {
    return res.status(400).json({
      error: "Invalid request.",
      message: "Invalid JSON format."
    });
  }

  console.error("Unhandled Error:", err);

  return res.status(500).json({
    error: "Internal server error",
    message: "Something went wrong"
  });
});

export { app, initializeRoutes };