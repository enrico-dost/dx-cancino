/**
 * Unit Request Consumer (OMB)
 * Listens for unit member requests from DOSTTrack
 * Fetches unit data and sends response back via Kafka
 */

import { Kafka } from 'kafkajs';
import { OMB_CONFIG } from '../config/config.js';
import { sendUnitResponse } from '../producers/unitResponseProducer.js';
import { Pool } from 'pg';

const kafka = new Kafka({
  clientId: OMB_CONFIG.CLIENT_ID,
  brokers: OMB_CONFIG.KAFKA_BROKERS,
});

const consumer = kafka.consumer({
  groupId: OMB_CONFIG.UNIT_REQUEST_GROUP_ID,
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
  requestId: string;
  unit_id: number;
  limit: number; // Number of member avatars to fetch (default: 4)
  timestamp: number;
}

/**
 * Fetch unit members from database
 */
async function fetchUnitMembers(unitId: number): Promise<{ user_ids: number[]; totalMembers: number } | null> {
  const client = await pool.connect();
  try {
    // First, check if unit exists and is active
    const unitQuery = `
      SELECT unit_id, name 
      FROM tblunits 
      WHERE unit_id = $1 AND is_active = true
    `;
    const unitResult = await client.query(unitQuery, [unitId]);
    
    if (unitResult.rows.length === 0) {
      return null; // Unit not found or inactive
    }

    // Get all active members with their user_ids
    const membersQuery = `
      SELECT um.user_id
      FROM tblunit_members um
      WHERE um.unit_id = $1 AND um.is_active = true
      ORDER BY um.created_at ASC
    `;
    const membersResult = await client.query(membersQuery, [unitId]);
    
    // Extract user_ids
    const user_ids = membersResult.rows.map(row => row.user_id);
    const totalMembers = user_ids.length;

    return {
      user_ids,
      totalMembers
    };

  } finally {
    client.release();
  }
}

/**
 * Process unit members request from DOSTTrack
 */
async function processUnitRequest(request: UnitRequest): Promise<void> {
  const { requestId, unit_id } = request;

  console.log(`📨 [OMB] Received unit members request: ${requestId} for unit_id: ${unit_id}`);

  try {
    // Fetch real unit data from database
    const unitData = await fetchUnitMembers(unit_id);

    if (!unitData) {
      // Unit not found - send error response
      await sendUnitResponse({
        requestId,
        unit_id,
        user_ids: [],
        total_members: 0,
        error: `Unit with ID ${unit_id} not found or inactive`,
        timestamp: Date.now(),
      });
      console.log(`⚠️ [OMB] Unit not found: ${unit_id}`);
      return;
    }

    // Send successful response with user_ids (DOSTTrack will get avatars from UPMB)
    await sendUnitResponse({
      requestId,
      unit_id,
      user_ids: unitData.user_ids,
      total_members: unitData.totalMembers,
      timestamp: Date.now(),
    });

    console.log(`✅ [OMB] Sent unit members response: ${requestId} for unit_id: ${unit_id} (${unitData.totalMembers} members, user_ids: [${unitData.user_ids.join(', ')}])`);
  } catch (error) {
    console.error(`❌ [OMB] Error processing unit request ${requestId}:`, error);
    
    // Send error response
    await sendUnitResponse({
      requestId,
      unit_id,
      user_ids: [],
      total_members: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now(),
    });
  }
}

/**
 * Start consuming unit member requests
 */
export async function startUnitRequestConsumer(): Promise<void> {
  if (consumerRunning) {
    console.log('⚠️ [OMB] Unit Request Consumer is already running');
    return;
  }

  try {
    await consumer.connect();
    await consumer.subscribe({
      topic: OMB_CONFIG.UNIT_REQUEST_TOPIC,
      fromBeginning: false,
    });

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const request = JSON.parse(message.value?.toString() || '{}') as UnitRequest;
          await processUnitRequest(request);
        } catch (error) {
          console.error('❌ [OMB] Error processing unit request:', error);
        }
      },
    });

    consumerRunning = true;
    console.log(`✅ [OMB] Unit Request Consumer started on topic: ${OMB_CONFIG.UNIT_REQUEST_TOPIC}`);
  } catch (error) {
    console.error('❌ [OMB] Unit Request Consumer Error:', error);
    throw error;
  }
}

/**
 * Stop the consumer
 */
export async function stopUnitRequestConsumer(): Promise<void> {
  if (consumerRunning) {
    await consumer.disconnect();
    consumerRunning = false;
    console.log('✅ [OMB] Unit Request Consumer stopped');
  }
}