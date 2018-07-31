import { observable, action, reaction } from 'mobx';
import _ from 'lodash';

const INIT_VALUES = {
  currList: ['21e389b909c7ab977088c8d43802d459b0eb521a'],
};

export default class {
  @observable currList = INIT_VALUES.currList

  constructor(app) {
    this.app = app;
  }

  @action
  setFavorite = (topicAddress) => {
    if (this.isInFavorite(topicAddress)) this.currList = this.currList.filter(x => x !== topicAddress);
    else {
      this.currList.push(topicAddress);
      this.currList.replace(this.currList);
    }
  }

  @action
  isInFavorite = (topicAddress) => this.currList.some(x => x === topicAddress)
}
