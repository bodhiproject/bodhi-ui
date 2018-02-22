import gql from 'graphql-tag';

import { getQueryFields } from './graphDataStruct';

export default subscriptions = {
  ON_SYNC_INFO: gql`
    subscription onSyncInfo {
      OnSyncInfo {
        ${getQueryFields('syncInfo')}
      }
    }
  `,
};

export const channels = {
	ON_SYNC_INFO: 'OnSyncInfo',
};
