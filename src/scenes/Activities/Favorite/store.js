import { observable, action, reaction } from 'mobx';
import { uniqBy, difference, orderBy } from 'lodash';
import { Routes, SortBy, OracleStatus } from 'constants';
import { queryAllTopics, queryAllOracles } from '../../../network/graphql/queries';

const INIT_VALUES_FAVPAGE = {
  displayList: [], // data list
  loading: true,
};

export default class FavoriteStore {
  @observable favList = JSON.parse(localStorage.getItem('bodhi_dapp_favList')) || []; // Data example: ['21e389b909c7ab977088c8d43802d459b0eb521a', ...]
  @observable displayList = INIT_VALUES_FAVPAGE.displayList
  @observable loading = INIT_VALUES_FAVPAGE.loading

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
  setFavorite = async (topicAddress) => {
    if (!topicAddress) return;
    if (this.isInFavorite(topicAddress)) {
      this.favList = this.favList.filter(x => x !== topicAddress);
    } else {
      this.favList.push(topicAddress);
    }
    this.updateLocalStorageFavList();
  }

  isInFavorite = (topicAddress) => !!this.favList.find(x => x === topicAddress);

  @action
  init = async () => {
    Object.assign(this, INIT_VALUES_FAVPAGE); // reset to initial state
    this.app.ui.location = Routes.FAVORITE; // change ui location, for tabs to render correctly
    this.displayList = await this.fetchFav();
    this.loading = false;
  }

  @action
  fetchFav = async () => {
    if (this.favList.length === 0) return [];
    // Get all event in WITHDRAW phase as Topic at favorite topic address list "favList"
    const topicOrderBy = { field: 'endTime', direction: SortBy.ASCENDING };
    const topicFilters = this.favList.map(topicAddress => ({ address: topicAddress, status: OracleStatus.WITHDRAW }));
    const { topics } = await queryAllTopics(this.app, topicFilters, topicOrderBy, 5000);

    // For those events which is not in WITHDRAW phase, search for the latest oracle
    const locatedTopics = topics.map(topicObject => (topicObject.address));
    const oracleFilters = difference(this.favList, locatedTopics).map(omittedTopicAddress => ({ topicAddress: omittedTopicAddress }));
    const oracleOrderBy = { field: 'blockNum', direction: SortBy.DESCENDING };
    const { oracles } = await queryAllOracles(this.app, oracleFilters, oracleOrderBy, 5000);
    const oracleResult = uniqBy(oracles, 'topicAddress');

    // Combine both WITHDRAW topics and latest phase oracles into result
    const result = orderBy([...topics, ...oracleResult], ['endTime']);
    return result;
  }
}
