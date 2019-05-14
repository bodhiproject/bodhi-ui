import { gql } from 'apollo-boost';
import client from '.';
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

export const subscribeSyncInfo = async (cb) => {
  client().subscribe({
    query: SUBSCRIPTIONS.onSyncInfo,
    fetchPolicy: 'network-only',
  }).subscribe({
    next(data) {
      cb(null, data.onSyncInfo);
    },
    error(err) {
      cb(err);
    },
  });
};
