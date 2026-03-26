import { Kafka } from 'kafkajs';

export const kafka = new Kafka({
  clientId: 'workorder-service', 
  brokers: ['localhost:9092'],   
});