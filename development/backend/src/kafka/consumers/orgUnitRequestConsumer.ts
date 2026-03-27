/**
 * Org Unit Request Consumer (OMB)
 * Listens for org unit requests from DOSTTrack
 * Retrieves org unit information and sends response back via Kafka
 */

import { Kafka } from 'kafkajs';
import { OMB_CONFIG } from '../config/config.js';
import { sendOrgUnitResponse } from '../producers/orgUnitResponseProducer.js';
import { Pool } from 'pg';

const kafka = new Kafka({
  clientId: OMB_CONFIG.CLIENT_ID,
  brokers: OMB_CONFIG.KAFKA_BROKERS,
});

const consumer = kafka.consumer({
  groupId: OMB_CONFIG.ORG_UNIT_GROUP_ID,
});

let consumerRunning = false;

interface OrgUnitRequest {
  requestId: string,
  org_unit_id: number,
  timestamp: number
}

type OrgUnit = {
  org_unit_id: number,
  org_unit_name: string
}

// Database connection
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

/**
 * Retrieve org unit information
 */
async function fetchOrgUnit(org_unit_id: number): Promise<OrgUnit | null> {
  const client = await pool.connect();

  try {
    //Retrieve org unit
    const query = `
      SELECT
        org_unit_id,
        org_unit_name
      FROM tblorganizational_units
      Where org_unit_id = $1
    `;

    const result = await client.query(query, [org_unit_id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    const orgUnit: OrgUnit = {
      org_unit_id: org_unit_id,
      org_unit_name: result.rows[0].org_unit_name
    };

    return orgUnit;
  } finally {
    client.release();
  }
}

/**
 * Process org unit request
 */
async function processOrgUnitRequest(request: OrgUnitRequest): Promise<void> {
  const {requestId, org_unit_id} = request;

  console.log(`📨 [OMB] Received org unit request: ${requestId}`);

  try {
    const orgUnit = await fetchOrgUnit(org_unit_id);

    if (!orgUnit) {
      await sendOrgUnitResponse({
        requestId,
        org_unit_id: org_unit_id,
        org_unit_name: null,
        error: `Failed to fetch org unit`,
        timestamp: Date.now()
      });

      console.log(`⚠️ [OMB] Failed to fetch org unit`);
      return;
    }

    // Send successful response with org unit information
    await sendOrgUnitResponse({
      requestId,
      org_unit_id: org_unit_id,
      org_unit_name: orgUnit.org_unit_name,
      timestamp: Date.now(),
    });
    
  } catch (error) {
    console.error(`❌ [OMB] Error processing org unit request ${requestId}:`, error);

    await sendOrgUnitResponse({
        requestId,
        org_unit_id: org_unit_id,
        org_unit_name: null,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: Date.now()
      });
  }
}

/**
 * Start consuming org unit requests
 */

export async function startOrgUnitRequestConsumer(): Promise<void> {
  if (consumerRunning) {
    console.log('⚠️ [OMB] Org Unit Request Consumer is already running');
    return;
  }

  try {
    await consumer.connect();
    await consumer.subscribe({
      topic: OMB_CONFIG.ORG_UNIT_REQUEST_TOPIC,
      fromBeginning: false
    });

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const request = JSON.parse(message.value?.toString() || '{}') as OrgUnitRequest;
          await processOrgUnitRequest(request);
        } catch (error) {
          console.error('❌ [OMB] Error processing org unit request:', error);
        }
      }
    });

    consumerRunning = true;
    console.log(`✅ [OMB] Org Unit Request Consumer started on topic: ${OMB_CONFIG.ORG_UNIT_REQUEST_TOPIC}`);
  } catch (error) {
    console.error('❌ [OMB] Org Unit Request Consumer Error:', error);
    throw error;
  }
}

/**
 * Stop the consumer
 */
export async function stopUserAvatarRequestConsumer(): Promise<void> {
  if (consumerRunning) {
    await consumer.disconnect();
    consumerRunning = false;
    console.log('✅ [OMB] Org Unit Request Consumer stopped');
  }
}