import gql from 'graphql-tag';

import client from './graphClient';
import { getQueryFields } from './graphDataStruct';

export function subscribeSyncInfo() {
  const query = gql`
    subscription onNewSyncInfo {
      syncInfo {
        ${getQueryFields('syncInfo')}
      }
    }
  `;

  client.subscribe({
    query,
    variables: {},
  }).subscribe((response) => {
    console.log(response);
  });
}
