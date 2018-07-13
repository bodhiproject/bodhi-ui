import { observable, action } from 'mobx';

const INIT_VALUES = {
  status: false,
  type: '',
};

export default class {
  @observable status = INIT_VALUES.status
  @observable type = INIT_VALUES.type

  @action
  trigger = (type = '') => {
    this.status = !this.status;
    this.type = type;
  }
}
