/**
 * Unit Response Producer (OMB)
 * Sends unit member responses back to DOSTTrack
 */

import { Kafka } from 'kafkajs';
import { OMB_CONFIG } from '../config/config.js';

const kafka = new Kafka({
  clientId: OMB_CONFIG.CLIENT_ID,
  brokers: OMB_CONFIG.KAFKA_BROKERS,
});

const producer = kafka.producer();
let producerConnected = false;

export interface UnitResponse {
  requestId: string;
  unit_id: number;
  user_ids: number[];
  total_members: number;
  error?: string;
  timestamp: number;
}

/**
 * Ensure producer is connected
 */
async function ensureProducerConnected(): Promise<void> {
  if (!producerConnected) {
    await producer.connect();
    producerConnected = true;
    console.log('✅ [OMB] Unit Response Producer connected');
  }
}

/**
 * Send unit members response to DOSTTrack
 */
export async function sendUnitResponse(response: UnitResponse): Promise<void> {
  try {
    await ensureProducerConnected();

    await producer.send({
      topic: OMB_CONFIG.UNIT_RESPONSE_TOPIC,
      messages: [
        {
          value: JSON.stringify(response),
          key: response.requestId,
        },
      ],
    });

    console.log(`✅ [OMB] Sent unit response: ${response.requestId}`);
  } catch (error) {
    console.error('❌ [OMB] Failed to send unit response:', error);
    throw error;
  }
}

/**
 * Stop the producer
 */
export async function stopUnitResponseProducer(): Promise<void> {
  if (producerConnected) {
    await producer.disconnect();
    producerConnected = false;
    console.log('✅ [OMB] Unit Response Producer stopped');
  }
}