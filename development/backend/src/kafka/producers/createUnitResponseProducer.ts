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

export interface CreateUnitResponse {
  requestId: string,
  status: number,
  message: string | null,
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
    console.log('✅ [OMB] Create Unit Response Producer connected');
  }
}

/**
 * Send create unit response to DOSTTrack
 */
export async function sendCreateUnitResponse(response: CreateUnitResponse): Promise<void> {
  try {
    await ensureProducerConnected();

    await producer.send({
      topic: OMB_CONFIG.CREATE_UNIT_RESPONSE_TOPIC,
      messages: [
        {
          value: JSON.stringify(response),
          key: response.requestId,
        },
      ],
    });

    console.log(`✅ [OMB] Sent create unit response: ${response.requestId}`);
  } catch (error) {
    console.error('❌ [OMB] Failed to send create unit response:', error);
    throw error;
  }
}

/**
 * Stop the producer
 */
export async function stopCreateUnitResponseProducer(): Promise<void> {
  if (producerConnected) {
    await producer.disconnect();
    producerConnected = false;
    console.log('✅ [OMB] Create Unit Response Producer stopped');
  }
}