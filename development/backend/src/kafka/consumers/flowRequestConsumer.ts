/**
 * Flow Request Consumer (OMB)
 * Listens for flow requests from DOSTTrack
 * Fetches receiving officer IDs for units in the flow and sends response back via Kafka
 */

import { Kafka } from 'kafkajs';
import { OMB_CONFIG } from '../config/config.js';
import { sendFlowResponse } from '../producers/flowResponseProducer.js';
import { Pool } from 'pg';

const kafka = new Kafka({
  clientId: OMB_CONFIG.CLIENT_ID,
  brokers: OMB_CONFIG.KAFKA_BROKERS,
});

const consumer = kafka.consumer({
  groupId: OMB_CONFIG.FLOW_REQUEST_GROUP_ID,
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

export interface FlowRequest {
  requestId: string;
  flow_id: number;
  unit_ids: number[]; // Unit IDs from DOSTTrack's tblunit_flow_steps
  limit: number; // Number of officer avatars to fetch (default: 4)
  timestamp: number;
}

/**
 * Fetch receiving officer IDs for the given units
 */
async function fetchReceivingOfficers(unitIds: number[]): Promise<{ officer_ids: number[]; total_units: number } | null> {
  const client = await pool.connect();
  try {
    if (unitIds.length === 0) {
      return { officer_ids: [], total_units: 0 };
    }

    // Get receiving officer IDs for the units
    const query = `
      SELECT receiving_officer_id
      FROM tblunits
      WHERE unit_id = ANY($1::int[]) 
        AND is_active = true
        AND receiving_officer_id IS NOT NULL
      ORDER BY unit_id ASC
    `;
    
    const result = await client.query(query, [unitIds]);

    // Extract officer IDs
    const officer_ids = result.rows
      .map(row => row.receiving_officer_id)
      .filter(id => id !== null);

    return {
      officer_ids,
      total_units: unitIds.length
    };

  } finally {
    client.release();
  }
}

/**
 * Process flow request from DOSTTrack
 */
async function processFlowRequest(request: FlowRequest): Promise<void> {
  const { requestId, flow_id, unit_ids } = request;

  console.log(`📨 [OMB] Received flow request: ${requestId} for flow_id: ${flow_id} with ${unit_ids.length} units`);

  try {
    // Fetch receiving officer IDs for the units
    const flowData = await fetchReceivingOfficers(unit_ids);

    if (!flowData) {
      // Error fetching data
      await sendFlowResponse({
        requestId,
        flow_id,
        officer_ids: [],
        total_units: 0,
        error: `Failed to fetch receiving officers for flow_id ${flow_id}`,
        timestamp: Date.now(),
      });
      console.log(`⚠️ [OMB] Failed to fetch flow data for flow_id: ${flow_id}`);
      return;
    }

    // Send successful response with officer IDs (DOSTTrack will get avatars from UPMB)
    await sendFlowResponse({
      requestId,
      flow_id,
      officer_ids: flowData.officer_ids,
      total_units: flowData.total_units,
      timestamp: Date.now(),
    });

    console.log(`✅ [OMB] Sent flow response: ${requestId} for flow_id: ${flow_id} (${flowData.total_units} units, officer_ids: [${flowData.officer_ids.join(', ')}])`);
  } catch (error) {
    console.error(`❌ [OMB] Error processing flow request ${requestId}:`, error);
    
    // Send error response
    await sendFlowResponse({
      requestId,
      flow_id,
      officer_ids: [],
      total_units: 0,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now(),
    });
  }
}

/**
 * Start consuming flow requests
 */
export async function startFlowRequestConsumer(): Promise<void> {
  if (consumerRunning) {
    console.log('⚠️ [OMB] Flow Request Consumer is already running');
    return;
  }

  try {
    await consumer.connect();
    await consumer.subscribe({
      topic: OMB_CONFIG.FLOW_REQUEST_TOPIC,
      fromBeginning: false,
    });

    await consumer.run({
      eachMessage: async ({ message }) => {
        try {
          const request = JSON.parse(message.value?.toString() || '{}') as FlowRequest;
          await processFlowRequest(request);
        } catch (error) {
          console.error('❌ [OMB] Error processing flow request:', error);
        }
      },
    });

    consumerRunning = true;
    console.log(`✅ [OMB] Flow Request Consumer started on topic: ${OMB_CONFIG.FLOW_REQUEST_TOPIC}`);
  } catch (error) {
    console.error('❌ [OMB] Flow Request Consumer Error:', error);
    throw error;
  }
}

/**
 * Stop the consumer
 */
export async function stopFlowRequestConsumer(): Promise<void> {
  if (consumerRunning) {
    await consumer.disconnect();
    consumerRunning = false;
    console.log('✅ [OMB] Flow Request Consumer stopped');
  }
}
