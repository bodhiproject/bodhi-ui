import gql from 'graphql-tag';

import { getTypeDef } from './graphDataStruct';

const subscriptions = {
  ON_SYNC_INFO: gql`
    subscription OnSyncInfo {
      OnSyncInfo {
        ${getTypeDef('SyncInfo')}
      }
    }
  `,
};

export default subscriptions;
export const channels = {
  ON_SYNC_INFO: 'OnSyncInfo',
};
