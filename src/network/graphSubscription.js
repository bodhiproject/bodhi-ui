import gql from 'graphql-tag';

import { getTypeDef } from './graphSchema';

const subscriptions = {
  onSyncInfo: `
    subscription OnSyncInfo {
      onSyncInfo {
        ${getTypeDef('SyncInfo')}
      }
    }
  `,
};

function getSubscription(name) {
  return gql`${subscriptions[name]}`;
}

export default getSubscription;
export const channels = {
  ON_SYNC_INFO: 'onSyncInfo',
};
