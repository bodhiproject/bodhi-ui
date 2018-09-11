import _ from 'lodash';
import { observable, runInAction, action } from 'mobx';
import { searchOracles, searchTopics } from '../../network/graphql/queries';
import Oracle from '../../stores/models/Oracle';
import Topic from '../../stores/models/Topic';
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
    let oracles = await searchOracles(phrase);
    oracles = _.uniqBy(oracles, 'txid').map((oracle) => new Oracle(oracle, this.app));
    let topics = await searchTopics(phrase);
    topics = _.uniqBy(topics, 'txid').map((topic) => new Topic(topic, this.app));
    result = [...oracles, ...topics];
    return _.orderBy(result, ['endTime']);
  }
}
