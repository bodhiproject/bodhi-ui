import { gql } from 'apollo-boost';
import { SYNC_INFO } from './schema';

const SUBSCRIPTIONS = {
  onSyncInfo: gql`
    subscription {
      onSyncInfo {
        ${SYNC_INFO}
      }
    }
  `,
};

export const subscribeSyncInfo = async (client, cb) => {
  client.subscribe({
    query: SUBSCRIPTIONS.onSyncInfo,
    fetchPolicy: 'network-only',
  }).subscribe({
    next(data) {
      console.log('NAKA: next -> data', data);
      cb(null, data.onSyncInfo);
    },
    error(err) {
      console.log('NAKA: error -> err', err);
      cb(err);
    },
  });
};
