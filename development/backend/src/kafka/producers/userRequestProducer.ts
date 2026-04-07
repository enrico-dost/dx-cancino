import { Partitioners } from 'kafkajs';
import { kafka } from '../config/kafka.config';
import { userCache, userEvents } from '../consumers/userConsumer';

const producer = kafka.producer({ createPartitioner: Partitioners.LegacyPartitioner });

export const sendUserListRequest = async (userIds: number[]): Promise<any[]> => {
  const requestId = `req-${Date.now()}`;
  await producer.connect();

  return new Promise(async (resolve) => {
    // 1. Function para kuhanin ang data sa cache
    const getDetailedList = () => {
      return userIds.map(id => {
        const cached = userCache.get(Number(id));
        return cached ? { user_id: id, ...cached } : { user_id: id, first_name: 'Unknown', last_name: '', avatar: '' };
      });
    };

    // 2. Timeout Safety (10 seconds)
    const timeout = setTimeout(() => {
      userEvents.off('cache_updated', onCacheUpdate);
      console.log(`⚠️ Kafka Timeout for ${requestId}`);
      resolve(getDetailedList());
    }, 10000);

    // 3. wait for the request in consumer
    const onCacheUpdate = (incomingRequestId: string) => {
      if (incomingRequestId === requestId) {
        clearTimeout(timeout);
        userEvents.off('cache_updated', onCacheUpdate);
        resolve(getDetailedList());
      }
    };

    userEvents.on('cache_updated', onCacheUpdate);

    // 4. Fire the Request
    await producer.send({
      topic: 'user-list-request',
      messages: [{ value: JSON.stringify({ requestId, userIds }) }],
    });
  });
};