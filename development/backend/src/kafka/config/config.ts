/**
 * Organization Management Backend Kafka Configuration
 * Configuration for Kafka consumers and producers
 */

export const OMB_CONFIG = {
  KAFKA_BROKERS: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
  CLIENT_ID: 'omb-backend',
  
  // Unit Request Group & Topics
  UNIT_REQUEST_GROUP_ID: 'omb-unit-request-group',
  UNIT_REQUEST_TOPIC: 'workorder-recipient-unit-request',
  UNIT_RESPONSE_TOPIC: 'workorder-recipient-unit-response',
  
  // Flow Request Group & Topics
  FLOW_REQUEST_GROUP_ID: 'omb-flow-request-group',
  FLOW_REQUEST_TOPIC: 'workorder-recipient-flow-request',
  FLOW_RESPONSE_TOPIC: 'workorder-recipient-flow-response',
};