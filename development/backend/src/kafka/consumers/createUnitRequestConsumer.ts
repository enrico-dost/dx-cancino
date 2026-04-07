/**
 * Create Unit Request Consumer (OMB)
 * Listens for create unit requests from DOSTTrack
 * Qeuries create unit and sends response back via Kafka
 */

import { Kafka } from 'kafkajs';
import { OMB_CONFIG } from '../config/config.js';
import { sendCreateUnitResponse } from '../producers/createUnitResponseProducer.js';
import { Pool } from 'pg';

const kafka = new Kafka({
  clientId: OMB_CONFIG.CLIENT_ID,
  brokers: OMB_CONFIG.KAFKA_BROKERS,
});

const consumer = kafka.consumer({
  groupId: OMB_CONFIG.CREATE_UNIT_GROUP_ID,
});

let consumerRunning = false;

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

export interface UnitRequest {
  requestId: string,
  name: string,
  org_unit_id: number,
  receiving_officer_id: number,
  members: number[],
  user_id: number,
  timestamp: number
}

/**
 * Query create unit to database
 */
async function queryCreateUnit(name: string, org_unit_id: number, receiving_officer_id: number, members: number[], user_id: number): Promise<any> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Check for duplicate unit name
    const unitQuery = `
      SELECT unit_id, name 
      FROM tblunits 
      WHERE name = $1 AND is_active = true
    `;
    const unitResult = await client.query(unitQuery, [name]);
    
    if (unitResult.rows.length === 1) {
      return null; // Duplicate name
    }

    // Insert new unit
    const insertUnitQuery = `
      INSERT INTO tblunits(
        name,
        receiving_officer_id,
        org_unit_id,
        created_by
      ) 
      VALUES (
        $1, $2, $3, $4
      )
      RETURNING unit_id;
    `;

    const insertUnitResult = await client.query(insertUnitQuery, [name, receiving_officer_id, org_unit_id, user_id]);
    const unit_id = insertUnitResult.rows[0].unit_id;
    
    // Insert unit members
    const membersQuery = `
      INSERT INTO tblunit_members (
        unit_id,
        user_id,
        created_by
      )
      SELECT $1, UNNEST($2::int[]), $3
    `;
    
    const membersResult = await client.query(membersQuery, [unit_id, members, user_id]);

    await client.query('COMMIT');

    return unit_id;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

/**
 * Process create unit request from DOSTTrack
 */
async function processCreateUnitRequest(request: UnitRequest): Promise<void> {
  const { requestId, name, org_unit_id, receiving_officer_id, members, user_id } = request;

  console.log(`📨 [OMB] Received create unit request: ${requestId} for: ${name}`);

  try {
    // Query request to database
    const unitData = await queryCreateUnit(name, org_unit_id, receiving_officer_id, members, user_id);

    if (!unitData) {
      // Unit not found - send error response
      await sendCreateUnitResponse({
        requestId,
        status: 409,
        message: null,
        error: `Unit name already exist`,
        timestamp: Date.now(),
      });
      console.log(`⚠️ [OMB] Unit name already exist: ${name}`);
      return;
    }

    // Send successful response message to DOSTTrack
    await sendCreateUnitResponse({
      requestId,
      status: 200,
      message: `Unit created successfully.`,
      timestamp: Date.now(),
    });

    console.log(`✅ [OMB] Sent create unit response: ${requestId} for unit_id: ${name}`);
  } catch (error) {
    console.error(`❌ [OMB] Error processing create unit request ${requestId}:`, error);
    
    // Send error response
    await sendCreateUnitResponse({
      requestId,
      status: 500,
      message: null,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now(),
    });
  }
}

/**
 * Start consuming unit member requests
 */
export async function startCreateUnitRequestConsumer(): Promise<void> {
  if (consumerRunning) {
    console.log('⚠️ [OMB] Create Unit Request Consumer is already running');
    return;
  }

  try {
    await consumer.connect();
    await consumer.subscribe({
      topic: OMB_CONFIG.CREATE_UNIT_REQUEST_TOPIC,
      fromBeginning: false,
    });

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const request = JSON.parse(message.value?.toString() || '{}') as UnitRequest;
          await processCreateUnitRequest(request);
        } catch (error) {
          console.error('❌ [OMB] Error processing create unit request:', error);
        }
      },
    });

    consumerRunning = true;
    console.log(`✅ [OMB] Create Unit Request Consumer started on topic: ${OMB_CONFIG.CREATE_UNIT_REQUEST_TOPIC}`);
  } catch (error) {
    console.error('❌ [OMB] Create Unit Request Consumer Error:', error);
    throw error;
  }
}

/**
 * Stop the consumer
 */
export async function stopCreateUnitRequestConsumer(): Promise<void> {
  if (consumerRunning) {
    await consumer.disconnect();
    consumerRunning = false;
    console.log('✅ [OMB] Create Unit Request Consumer stopped');
  }
}