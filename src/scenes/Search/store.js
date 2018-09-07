import _ from 'lodash';
import { observable } from 'mobx';
import { Routes } from 'constants';
import { searchOracles } from '../../network/graphql/queries';
import Oracle from '../../stores/models/Oracle';
export default class SearchStore {
  @observable list = [];
  @observable phrase = '';

  constructor(app) {
    this.app = app;
  }

  init = async (phrase) => {
    this.app.ui.location = Routes.SEARCH;
    this.list = await this.fetch(phrase || this.phrase);
  }

  async fetch(phrase) {
    let result = [];
    result = await searchOracles(phrase);
    result = _.uniqBy(result, 'txid').map((oracle) => new Oracle(oracle, this.app));
    return _.orderBy(result, ['endTime']);
  }
}
