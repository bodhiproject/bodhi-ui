import gql from 'graphql-tag';

import { getTypeDef } from './graphDataStruct';

const subscriptions = {
  OnSyncInfo: `
    subscription OnSyncInfo {
      OnSyncInfo {
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
  ON_SYNC_INFO: 'OnSyncInfo',
};
