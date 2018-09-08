import _ from 'lodash';
import { observable, runInAction, action } from 'mobx';
import { searchOracles } from '../../network/graphql/queries';
import Oracle from '../../stores/models/Oracle';
export default class SearchStore {
  @observable list = [];
  @observable phrase = '';
  @observable loading = false;

  constructor(app) {
    this.app = app;
  }

  @action
  init = async () => {
    this.loading = true;
    this.list = await this.fetch(this.phrase);
    runInAction(() => { this.loading = false; });
  }

  async fetch(phrase) {
    let result = [];
    if (_.isEmpty(phrase)) return result;
    result = await searchOracles(phrase);
    result = _.uniqBy(result, 'txid').map((oracle) => new Oracle(oracle, this.app));
    return _.orderBy(result, ['endTime']);
  }
}
