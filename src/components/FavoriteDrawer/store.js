import { observable, action, reaction } from 'mobx';
import { each } from 'lodash';
import { SortBy } from 'constants';
import { STORAGE_KEY } from '../../config/app';
import { events } from '../../network/graphql/queries';

const INIT_VALUES = {
  visible: false,
  loading: true,
  favEvents: [],
};

export default class FavoriteStore {
  @observable visible = INIT_VALUES.visible;
  @observable loading = INIT_VALUES.loading
  // Data example: ['0xf5594dad875cf361b3cf5a2e9662528bb96ea89c', ...]
  @observable favAddresses = JSON.parse(localStorage.getItem(STORAGE_KEY.FAVORITES)) || [];
  @observable favEvents = INIT_VALUES.favEvents;

  constructor(app) {
    this.app = app;
    reaction(
      () => this.app.wallet.addresses + this.app.global.syncBlockNum + this.app.global.online,
      () => {
        if (this.app.global.online && this.visible) this.init();
      }
    );
    reaction(
      () => this.favAddresses,
      async () => this.queryEvents(),
    );
  }

  @action
  init = async () => {
    Object.assign(this, INIT_VALUES);
    await this.queryEvents();
    this.loading = false;
  }

  @action
  showDrawer = () => this.visible = true;

  @action
  hideDrawer = () => this.visible = false;

  @action
  setFavorite = async (eventAddress) => {
    if (!eventAddress) return;

    if (this.favAddresses.includes(eventAddress)) {
      this.favAddresses = this.favAddresses.filter(x => x !== eventAddress);
    } else {
      this.favAddresses.push(eventAddress);
    }

    // Update localStorage
    localStorage.setItem(STORAGE_KEY.FAVORITES, JSON.stringify(this.favAddresses));
  }

  queryEvents = async () => {
    if (this.favAddresses.length === 0) this.favEvents = [];

    const filters = [];
    each(this.favAddresses, (addr) => filters.push({ address: addr }));
    const paginatedEvents = await events(this.app.graphqlClient, {
      filter: { OR: filters },
      orderBy: [{ field: 'blockNum', direction: SortBy.DESCENDING }],
    });
    this.favEvents = paginatedEvents.items;
  }
}
