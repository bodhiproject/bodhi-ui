import { observable, action, runInAction, reaction } from 'mobx';
import _ from 'lodash';
import { Routes, SortBy, OracleStatus } from 'constants';
import { queryAllTopics, queryAllOracles } from '../../../network/graphql/queries';
import Topic from '../../../stores/models/Topic';
import Oracle from '../../../stores/models/Oracle';

const INIT_VALUES_FAVPAGE = {
  loaded: false, // loading state?
  loadingMore: true, // for loading icon?
  displayList: [], // data list
};

export default class {
  @observable favList = JSON.parse(localStorage.getItem('bodhi_dapp_favList')) || []; // Data example: '21e389b909c7ab977088c8d43802d459b0eb521a'

  @observable loaded = INIT_VALUES_FAVPAGE.loaded
  @observable displayList = INIT_VALUES_FAVPAGE.displayList
  @observable loadingMore = INIT_VALUES_FAVPAGE.loadingMore

  constructor(app) {
    this.app = app;
    reaction(
      () => this.app.wallet.addresses + this.app.global.syncBlockNum,
      () => {
        if (this.app.ui.location === Routes.FAVORITE) {
          this.init();
        }
      }
    );
    reaction(
      () => this.displayList,
      () => {
      }
    );
    reaction(
      () => this.favList,
      async () => {
        this.displayList = await this.fetchFav();
      }
    );
  }

  updateLocalStorageFavList() {
    localStorage.setItem('bodhi_dapp_favList', JSON.stringify(this.favList));
  }

  @action
  setFavorite = (topicAddress) => {
    if (this.isInFavorite(topicAddress)) this.favList = this.favList.filter(x => x !== topicAddress);
    else {
      this.favList.push(topicAddress);
      this.favList.replace(this.favList);
    }
    this.updateLocalStorageFavList();
  }

  @action
  isInFavorite = (topicAddress) => this.favList.some(x => x === topicAddress)

  @action
  loadMore = async () => {
    // TODO
  }

  @action
  init = async () => {
    Object.assign(this, INIT_VALUES_FAVPAGE); // reset to initial state
    this.app.ui.location = Routes.FAVORITE; // change ui location, for tabs to render correctly
    this.displayList = await this.fetchFav();
  }

  fetchFav = async () => {
    if (this.favList.length === 0) return [];
    // Get all event in WITHDRAW phase as Topic at favorite topic address list "favList"
    const topicOrderBy = { field: 'endTime', direction: SortBy.ASCENDING };
    const topicFilters = this.favList.map(topicAddress => ({ address: topicAddress, status: OracleStatus.WITHDRAW }));
    const topics = await queryAllTopics(topicFilters, topicOrderBy, Infinity, Infinity);
    const topicResult = _.uniqBy(topics, 'txid').map((topic) => new Topic(topic, this.app));

    // For those events which is not in WITHDRAW phase, search for the latest oracle
    const locatedTopics = topicResult.map(topicObject => (topicObject.address));
    const oracleFilters = _.difference(this.favList, locatedTopics).map(omittedTopicAddress => ({ topicAddress: omittedTopicAddress }));
    const oracleOrderBy = { field: 'blockNum', direction: SortBy.DESCENDING };
    const oracles = await queryAllOracles(oracleFilters, oracleOrderBy, Infinity, Infinity);
    const oracleResult = _.uniqBy(oracles, 'topicAddress').map((oracle) => new Oracle(oracle, this.app));

    // Combine both WITHDRAW topics and latest phase oracles into result
    const result = _.orderBy([...topicResult, ...oracleResult], ['endTime']);

    runInAction(() => {
      this.loadingMore = false;
      this.loaded = true;
    });
    return result;
  }
}
