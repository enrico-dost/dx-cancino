import { Pool } from 'pg';

export interface DatabaseService {
  query(text: string, params?: any[]): Promise<any>;
}

export class PostgresDatabaseService implements DatabaseService {
  private pool: Pool;

  constructor(connectionString: string) {
    this.pool = new Pool({
      connectionString,
    });
  }

  async query(text: string, params?: any[]): Promise<any> {
    const client = await this.pool.connect();
    try {
      const result = await client.query(text, params);
      return result;
    } finally {
      client.release();
    }
  }
}
