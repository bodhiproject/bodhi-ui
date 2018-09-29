import { observable, action } from 'mobx';

const INIT_VALUES = {
  visible: false,
  messageType: undefined,
  title: undefined,
  heading: undefined,
  body: undefined,
};

export default class GlobalDialogStore {
  @observable visible = INIT_VALUES.visible;
  @observable messageType = INIT_VALUES.messageType;
  @observable title = INIT_VALUES.title;
  @observable heading = INIT_VALUES.heading;
  @observable body = INIT_VALUES.body;

  @action
  reset = () => {
    Object.assign(this, INIT_VALUES);
  }

  /**
   * Sets the fields for an error dialog.
   * @param {string|object} heading Heading of the dialog.
   * @param {string|object} body Body of the dialog.
   */
  @action
  setError = (heading, body) => {
    this.messageType = 'ERROR';
    this.title = { id: 'str.error', defaultMessage: 'Error' };
    this.heading = heading;
    this.body = body;
    this.visible = true;
  }
}
