import gql from 'graphql-tag';

import { getQueryFields } from './graphDataStruct';

const subscriptions = {
  ON_SYNC_INFO: gql`
    subscription onSyncInfo {
      OnSyncInfo {
        ${getQueryFields('syncInfo')}
      }
    }
  `,
};

export default subscriptions;
export const channels = {
  ON_SYNC_INFO: 'OnSyncInfo',
};
