import gql from 'graphql-tag';

import { getTypeDef } from './schema';

const subscriptions = {
  onSyncInfo: `
    subscription OnSyncInfo {
      onSyncInfo {
        ${getTypeDef('SyncInfo')}
      }
    }
  `,
  onApproveSuccess: `
    subscription OnApproveSuccess {
      onApproveSuccess {
        ${getTypeDef('Transaction')}
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
  ON_APPROVE_SUCCESS: 'onApproveSuccess',
};
