import { EventEmitter } from 'events';
import { kafka } from '../config/kafka.config';

const consumer = kafka.consumer({ groupId: 'workorder-group-v2' });
export const userEvents = new EventEmitter(); 
export const userCache = new Map<number, { first_name: string; last_name: string; avatar: string }>();

export const connectUserConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'user-list-response', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      if (!message.value) return;

      try {
        const rawData = message.value.toString();
        const response = JSON.parse(rawData);

        if (response.users && Array.isArray(response.users)) {
          response.users.forEach((user: any) => {
            const userId = Number(user.user_id || user.id);
            userCache.set(userId, {
              first_name: user.first_name || '',
              last_name: user.last_name || '',
              avatar: user.avatar || ''
            });
          });

          if (response.requestId) {
            userEvents.emit('cache_updated', response.requestId);
          }
        }
      } catch (error) {
        console.error('❌ Error parsing Kafka message:', error);
      }
    },
  });
};