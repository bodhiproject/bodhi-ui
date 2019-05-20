import { observable, action, reaction } from 'mobx';
import { uniqBy, difference, orderBy } from 'lodash';
import { SortBy, OracleStatus } from 'constants';
import { queryAllTopics, queryAllOracles } from '../../network/graphql/queries';
import { STORAGE_KEY } from '../../config/app';

const INIT_VALUES = {
  visible: false,
  loading: true,
  displayList: [],
};

export default class FavoriteStore {
  @observable visible = INIT_VALUES.visible;
  @observable loading = INIT_VALUES.loading
  @observable displayList = INIT_VALUES.displayList
  // Data example: ['0xf5594dad875cf361b3cf5a2e9662528bb96ea89c', ...]
  @observable favList = JSON.parse(localStorage.getItem(STORAGE_KEY.FAVORITES)) || [];

  constructor(app) {
    this.app = app;
    reaction(
      () => this.app.wallet.addresses + this.app.global.syncBlockNum + this.app.global.online,
      () => {
        if (this.app.global.online && this.visible) this.init();
      }
    );
    reaction(
      () => this.favList,
      async () => {
        this.displayList = await this.fetchFav();
      }
    );
  }

  @action
  init = async () => {
    Object.assign(this, INIT_VALUES);
    this.displayList = await this.fetchFav();
    this.loading = false;
  }

  @action
  showDrawer = () => this.visible = true;

  @action
  hideDrawer = () => this.visible = false;

  @action
  setFavorite = async (eventAddress) => {
    if (!eventAddress) return;

    if (this.favList.includes(eventAddress)) {
      this.favList = this.favList.filter(x => x !== eventAddress);
    } else {
      this.favList.push(eventAddress);
    }

    // Update localStorage
    localStorage.setItem(STORAGE_KEY.FAVORITES, JSON.stringify(this.favList));
  }

  @action
  fetchFav = async () => {
    const searchResult = [];
    if (this.favList.length === 0) return [];
    // Get all event in WITHDRAW phase as Topic at favorite topic address list "favList"
    const topicOrderBy = { field: 'endTime', direction: SortBy.ASCENDING };
    const topicFilters = this.favList.map(topicAddress => ({ address: topicAddress, status: OracleStatus.WITHDRAW }));
    const { topics } = await queryAllTopics(this.app, topicFilters, topicOrderBy, 5000);
    searchResult.push(...topics);

    // For those events which is not in WITHDRAW phase, search for the latest oracle
    const locatedTopics = topics.map(topicObject => (topicObject.address));
    const oracleFilters = difference(this.favList, locatedTopics).map(omittedTopicAddress => ({ topicAddress: omittedTopicAddress }));
    if (oracleFilters.length > 0) {
      const oracleOrderBy = { field: 'blockNum', direction: SortBy.DESCENDING };
      const { oracles } = await queryAllOracles(this.app, oracleFilters, oracleOrderBy, 5000);
      const oracleResult = uniqBy(oracles, 'topicAddress');
      searchResult.push(...oracleResult);
    }

    // Combine both WITHDRAW topics and latest phase oracles into result
    const result = orderBy(searchResult, ['endTime']);
    return result;
  }
}
