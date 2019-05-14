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
    next(res) {
      cb(null, res.data.onSyncInfo);
    },
    error(err) {
      cb(err);
    },
  });
};
