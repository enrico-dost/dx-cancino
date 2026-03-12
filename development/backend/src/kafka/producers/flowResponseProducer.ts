/**
 * Flow Response Producer (OMB)
 * Sends flow receiving officer responses back to DOSTTrack
 */

import { Kafka } from 'kafkajs';
import { OMB_CONFIG } from '../config/config.js';

const kafka = new Kafka({
  clientId: OMB_CONFIG.CLIENT_ID,
  brokers: OMB_CONFIG.KAFKA_BROKERS,
});

const producer = kafka.producer();
let producerConnected = false;

export interface FlowResponse {
  requestId: string;
  flow_id: number;
  officer_ids: number[];
  total_units: number;
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
    console.log('✅ [OMB] Flow Response Producer connected');
  }
}

/**
 * Send flow receiving officers response to DOSTTrack
 */
export async function sendFlowResponse(response: FlowResponse): Promise<void> {
  try {
    await ensureProducerConnected();

    await producer.send({
      topic: OMB_CONFIG.FLOW_RESPONSE_TOPIC,
      messages: [
        {
          value: JSON.stringify(response),
          key: response.requestId,
        },
      ],
    });

    console.log(`✅ [OMB] Sent flow response: ${response.requestId}`);
  } catch (error) {
    console.error('❌ [OMB] Failed to send flow response:', error);
    throw error;
  }
}

/**
 * Stop the producer
 */
export async function stopFlowResponseProducer(): Promise<void> {
  if (producerConnected) {
    await producer.disconnect();
    producerConnected = false;
    console.log('✅ [OMB] Flow Response Producer stopped');
  }
}
