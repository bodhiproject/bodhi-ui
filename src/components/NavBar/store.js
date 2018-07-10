import { observable, action } from 'mobx';

const INIT_VALUES = {
  myActivitesCount: 0, // INIT_VALUESial loaded state
};


export default class NavBarStore {
  @observable myActivitesCount = INIT_VALUES.myActivitesCount

  @action.bound
  async init() {
    // this.myActivitesCount = await this.getMyActivitiesCount();
  }

  // @action.bound
  // async getMyActivitiesCount() {
  // }
}
