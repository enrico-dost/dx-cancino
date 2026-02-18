import { injectable } from 'inversify';
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Database Service Interface
 * Unified interface for database operations across all APIs
 */
export interface IDatabaseService {
  query(text: string, params?: any[]): Promise<any>;
  getPool(): Pool;
  initialize(): Promise<void>;
  close(): Promise<void>;
}

/**
 * Main Database Service
 * Implements both interface patterns for maximum compatibility
 * Supports both direct queries and pool access
 */
@injectable()
export class DatabaseService implements IDatabaseService {
  private pool: Pool;

  constructor() {
    // Support both connection string and individual parameters
    const connectionString = process.env.DATABASE_URL;
    
    if (connectionString) {
      this.pool = new Pool({
        connectionString,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
    } else {
      this.pool = new Pool({
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT || '5432'),
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
    }

    // Handle pool errors
    this.pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
    });
  }

  async initialize(): Promise<void> {
    try {
      // Test the connection
      const client = await this.pool.connect();
      console.log('✅ Database connected successfully');
      client.release();
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  /**
   * Execute a query directly
   * Compatible with Agency API pattern
   */
  async query(text: string, params?: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }

  /**
   * Get the underlying pool
   * Compatible with Organization API pattern
   */
  getPool(): Pool {
    return this.pool;
  }

  async close(): Promise<void> {
    await this.pool.end();
    console.log('Database pool closed');
  }
}

/**
 * Alternative implementation using connection string
 * For backward compatibility with Agency API
 */
export class PostgresDatabaseService implements IDatabaseService {
  private dbService: DatabaseService;

  constructor(connectionString: string) {
    // Set DATABASE_URL temporarily for DatabaseService
    process.env.DATABASE_URL = connectionString;
    this.dbService = new DatabaseService();
  }

  async query(text: string, params?: any[]): Promise<any> {
    return this.dbService.query(text, params);
  }

  getPool(): Pool {
    return this.dbService.getPool();
  }

  async initialize(): Promise<void> {
    return this.dbService.initialize();
  }

  async close(): Promise<void> {
    return this.dbService.close();
  }
}
