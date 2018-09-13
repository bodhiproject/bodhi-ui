import _ from 'lodash';
import { observable, runInAction, action } from 'mobx';
import { Phases } from 'constants';
import { searchOracles, searchTopics } from '../../network/graphql/queries';
import Oracle from '../../stores/models/Oracle';
import Topic from '../../stores/models/Topic';
const TAB_BET = 0;
const TAB_VOTE = 1;
const TAB_SET = 2;
const TAB_FINALIZE = 3;
const TAB_WITHDRAW = 4;
export default class SearchStore {
  @observable list = [];
  @observable phrase = '';
  @observable loading = false;
  @observable tabIdx = 0;
  @observable events = [];
  @observable bets = [];
  @observable votes = [];
  @observable sets = [];
  @observable withdraws = [];
  @observable finalizes = [];
  topicAddrs = null;

  constructor(app) {
    this.app = app;
  }

  @action
  init = async () => {
    this.topicAddrs = new Map();
    this.loading = true;
    this.list = await this.fetch(this.phrase);
    runInAction(() => {
      this.loading = false;
      /** the following is a temp work around as searchAll in backend, since we don't have a combined type of Oracle and Topic */
      this.withdraws = this.list.filter(event => event.phase === Phases.WITHDRAWING && this.topicAddrs.set(event.address, true));
      this.finalizes = this.list.filter(event => event.phase === Phases.FINALIZING && !this.topicAddrs.has(event.topicAddress) && this.topicAddrs.set(event.topicAddress, true));
      this.sets = this.list.filter(event => event.phase === Phases.RESULT_SETTING && !this.topicAddrs.has(event.topicAddress) && this.topicAddrs.set(event.topicAddress, true));
      this.votes = this.list.filter(event => event.phase === Phases.VOTING && event.status === 'VOTING' && !this.topicAddrs.has(event.topicAddress) && this.topicAddrs.set(event.topicAddress, true));
      this.bets = this.list.filter(event => event.phase === Phases.BETTING && event.status === 'VOTING' && !this.topicAddrs.has(event.topicAddress));
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
    });
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
