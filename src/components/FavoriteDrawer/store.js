import { observable, action, reaction } from 'mobx';
import { each } from 'lodash';
import { SortBy } from 'constants';
import { STORAGE_KEY } from '../../config/app';
import { events } from '../../network/graphql/queries';

const INIT_VALUES = {
  visible: false,
  loading: false,
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
      () => this.app.global.online + this.app.wallet.addresses,
      () => {
        if (this.app.global.online && this.visible) this.queryEvents();
      }
    );
    reaction(
      () => this.favAddresses,
      () => {
        if (this.visible) this.queryEvents();
      },
    );
  }

  @action
  showDrawer = async () => {
    this.visible = true;
    await this.queryEvents();
  }

  @action
  hideDrawer = () => this.visible = false;

  isFavorite = (eventAddress) => this.favAddresses.includes(eventAddress);

  @action
  setFavorite = async (eventAddress) => {
    if (!eventAddress) return;

    if (this.isFavorite(eventAddress)) {
      this.favAddresses = this.favAddresses.filter(x => x !== eventAddress);
    } else {
      this.favAddresses.push(eventAddress);
    }

    // Update localStorage
    localStorage.setItem(STORAGE_KEY.FAVORITES, JSON.stringify(this.favAddresses));
  }

  queryEvents = async () => {
    if (!this.visible) return;

    if (this.favAddresses.length === 0) {
      this.favEvents = [];
      return;
    }

    this.loading = true;

    const filters = [];
    each(this.favAddresses, (addr) => filters.push({ address: addr }));
    const paginatedEvents = await events(this.app.graphqlClient, {
      filter: { OR: filters },
      orderBy: [{ field: 'blockNum', direction: SortBy.DESCENDING }],
    });
    this.favEvents = paginatedEvents.items;

    this.loading = false;
  }
}
