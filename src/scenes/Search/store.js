import _ from 'lodash';
import { observable, runInAction, action } from 'mobx';
import { Phases, OracleStatus, SortBy } from 'constants';
import { searchOracles, searchTopics } from '../../network/graphql/queries';
import Oracle from '../../stores/models/Oracle';
import Topic from '../../stores/models/Topic';
const TAB_BET = 0;
const TAB_VOTE = 1;
const TAB_SET = 2;
const TAB_FINALIZE = 3;
const TAB_WITHDRAW = 4;
export default class SearchStore {
  @observable oracles = [];
  @observable phrase = '';
  @observable loading = false;
  @observable tabIdx = 0;
  @observable events = [];
  @observable bets = [];
  @observable votes = [];
  @observable sets = [];
  @observable withdraws = [];
  @observable finalizes = [];

  constructor(app) {
    this.app = app;
  }

  @action
  init = async () => {
    this.loading = true;
    await this.fetch(this.phrase);
    runInAction(() => {
      this.finalizes = this.oracles.filter(event => event.phase === Phases.FINALIZING);
      this.sets = this.oracles.filter(event => event.phase === Phases.RESULT_SETTING);
      this.votes = this.oracles.filter(event => event.phase === Phases.VOTING && event.status === 'VOTING');
      this.bets = this.oracles.filter(event => event.phase === Phases.BETTING && event.status === 'VOTING');
      switch (this.tabIdx) {
        case TAB_BET: {
          this.events = this.bets;
          break;
        }
        case TAB_VOTE: {
          this.events = this.votes;
          break;
        }
        case TAB_SET: {
          this.events = this.sets;
          break;
        }
        case TAB_FINALIZE: {
          this.events = this.finalizes;
          break;
        }
        case TAB_WITHDRAW: {
          this.events = this.withdraws;
          break;
        }
        default: {
          throw new Error(`Invalid tab index: ${this.tabIdx}`);
        }
      }
      this.loading = false;
    });
  }

  async fetch(phrase) {
    if (_.isEmpty(phrase)) return [];
    const orderBy = { field: 'blockNum', direction: SortBy.DESCENDING };
    let oracles = await searchOracles(phrase, null, orderBy);
    oracles = _.uniqBy(oracles, 'txid');
    oracles = _.uniqBy(oracles, 'topicAddress').map((oracle) => new Oracle(oracle, this.app));
    const topicFilters = [{ status: OracleStatus.WITHDRAW }];
    const topics = await searchTopics(phrase, topicFilters);
    this.withdraws = _.uniqBy(topics, 'txid').map((topic) => new Topic(topic, this.app));
    this.oracles = _.orderBy(oracles, ['endTime']);
  }
}
