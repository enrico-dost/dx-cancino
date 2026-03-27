/**
 * Unit Response Producer (OMB)
 * Sends create unit responses back to DOSTTrack
 */

import { Kafka } from 'kafkajs';
import { OMB_CONFIG } from '../config/config.js';

const kafka = new Kafka({
  clientId: OMB_CONFIG.CLIENT_ID,
  brokers: OMB_CONFIG.KAFKA_BROKERS,
});

const producer = kafka.producer();
let producerConnected = false;

export interface OrgUnitResponse {
  requestId: string,
  org_unit_id: number,
  org_unit_name: string | null,
  error?: string,
  timestamp: number,
}

/**
 * Ensure producer is connected
 */
export async function ensureProducerConnected(): Promise<void> {
  if (!producerConnected) {
    await producer.connect();
    producerConnected = true;
    console.log('✅ [OMB] Org Unit Response Producer connected');
  }
}

/**
 * Send org unit response to DOSTTrack
 */
export async function sendOrgUnitResponse(response: OrgUnitResponse): Promise<void> {
  try {
    await ensureProducerConnected();

    await producer.send({
      topic: OMB_CONFIG.ORG_UNIT_RESPONSE_TOPIC,
      messages: [
        {
          value: JSON.stringify(response),
          key: response.requestId,
        },
      ],
    });

    console.log(`✅ [OMB] Sent org unit response: ${response.requestId}`);
  } catch (error) {
    console.error('❌ [OMB] Failed to send org unit response:', error);
    throw error;
  }
}

/**s
 * Stop the producer
 */
export async function stopOrgUnitResponseProducer(): Promise<void> {
  if (producerConnected) {
    await producer.disconnect();
    producerConnected = false;
    console.log('✅ [OMB] Org Unit Response Producer stopped');
  }
}