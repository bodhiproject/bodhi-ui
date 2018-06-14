import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';
import Web3Utils from 'web3-utils';
import { Field, reduxForm, Form, change, untouch } from 'redux-form';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import Grid from 'material-ui/Grid';
import _TextField from 'material-ui/TextField';
import { InputAdornment } from 'material-ui/Input';
import Button from 'material-ui/Button';
import { FormControl, FormHelperText } from 'material-ui/Form';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import { withStyles } from 'material-ui/styles';

import ImportantNote from '../../components/ImportantNote/index';
import EventWarning from '../../components/EventWarning/index';
import CreateEventDatePicker from './components/CreateEventDatePicker/index';
import CreateEventOutcomes from './components/CreateEventOutcomes/index';
import CreateEventCreatorPicker from './components/CreateEventCreatorPicker/index';
import SelectAddressDialog from '../../components/SelectAddressDialog/index';
import graphqlActions from '../../redux/Graphql/actions';
import appActions from '../../redux/App/actions';
import styles from './styles';
import { Token, TransactionType } from '../../constants';
import { maxTransactionFee } from '../../config/app';
import { doesUserNeedToUnlockWallet } from '../../helpers/utility';

const MAX_LEN_EVENTNAME_HEX = 640;

const messages = defineMessages({
  required: {
    id: 'create.required',
    defaultMessage: 'Required',
  },
  title: {
    id: 'create.title',
    defaultMessage: 'Title',
  },
  dialogTitle: {
    id: 'create.dialogTitle',
    defaultMessage: 'Create an Event',
  },
  namePlaceholder: {
    id: 'create.namePlaceholder',
    defaultMessage: 'e.g. Who will be the next president of the United States?',
  },
  resultSetterPlaceholder: {
    id: 'create.resultSetterPlaceholder',
    defaultMessage: 'Enter the address of the result setter or select your own address',
  },
  nameLong: {
    id: 'create.nameLong',
    defaultMessage: 'Event name is too long.',
  },
  validBetEnd: {
    id: 'create.validBetEnd',
    defaultMessage: 'Must be at least 30 minutes after Prediction Start Time',
  },
  validResultSetStart: {
    id: 'create.validResultSetStart',
    defaultMessage: 'Must be greater than or equal to Prediction End Time',
  },
  validResultSetEnd: {
    id: 'create.validResultSetEnd',
    defaultMessage: 'Must be at least 30 minutes after Result Setting Start Time',
  },
  creator: {
    id: 'str.creator',
    defaultMessage: 'Creator',
  },
  resultSetter: {
    id: 'str.resultSetter',
    defaultMessage: 'Result Setter',
  },
  betStartTime: {
    id: 'create.betStartTime',
    defaultMessage: 'Prediction Start Time',
  },
  betEndTime: {
    id: 'create.betEndTime',
    defaultMessage: 'Prediction End Time',
  },
  resultSetStartTime: {
    id: 'create.resultSetStartTime',
    defaultMessage: 'Result Setting Start Time',
  },
  resultSetEndTime: {
    id: 'create.resultSetEndTime',
    defaultMessage: 'Result Setting End Time',
  },
  selectMyAddress: {
    id: 'create.selectMyAddress',
    defaultMessage: 'Select My Address',
  },
  outcomes: {
    id: 'str.outcomes',
    defaultMessage: 'Outcomes',
  },
  escrowNoteTitle: {
    id: 'create.escrowNoteTitle',
    defaultMessage: '{amount} BOT Escrow',
  },
  escrowNoteDesc: {
    id: 'create.escrowNoteDesc',
    defaultMessage: 'You will need to deposit {amount} BOT in escrow to create an event. You can withdraw it when the event is in the Withdraw stage.',
  },
  confirmCreateMsg: {
    id: 'txConfirmMsg.create',
    defaultMessage: 'create an event',
  },
  invalidAddress: {
    id: 'str.invalidQtumAddress',
    defaultMessage: 'Invalid QTUM Address',
  },
});

const ID_BETTING_START_TIME = 'bettingStartTime';
const ID_BETTING_END_TIME = 'bettingEndTime';
const ID_RESULT_SETTING_START_TIME = 'resultSettingStartTime';
const ID_RESULT_SETTING_END_TIME = 'resultSettingEndTime';
const ID_NAME = 'name';
const ID_OUTCOMES = 'outcomes';
const ID_RESULT_SETTER = 'resultSetter';
const ID_CREATOR_ADDRESS = 'creatorAddress';

let TIME_GAP_MIN_SEC = 30 * 60;
if (process.env.REACT_APP_ENV === 'dev') {
  TIME_GAP_MIN_SEC = 2 * 60;
}

const FORM_NAME = 'createEvent';

const fields = [
  ID_NAME,
  ID_OUTCOMES,
  ID_RESULT_SETTER,
  ID_CREATOR_ADDRESS,
  ID_BETTING_START_TIME,
  ID_BETTING_END_TIME,
  ID_RESULT_SETTING_START_TIME,
  ID_RESULT_SETTING_END_TIME,
];

const validate = (values, props) => {
  const { intl } = props;

  const errors = {};

  // check required fields
  const requiredFields = fields;
  requiredFields.forEach((field) => {
    if (_.isEmpty(values[field])) {
      errors[field] = intl.formatMessage(messages.required);
    }
  });

  // check dates
  const bettingStartTime = moment(values.bettingStartTime);
  const bettingEndTime = moment(values.bettingEndTime);
  const resultSettingStartTime = moment(values.resultSettingStartTime);
  const resultSettingEndTime = moment(values.resultSettingEndTime);

  if (bettingEndTime.unix() - bettingStartTime.unix() < TIME_GAP_MIN_SEC) {
    errors.bettingEndTime = intl.formatMessage(messages.validBetEnd);
  }

  if (resultSettingStartTime.unix() < bettingEndTime.unix()) {
    errors.resultSettingStartTime = intl.formatMessage(messages.validResultSetStart);
  }

  if (resultSettingEndTime.unix() - resultSettingStartTime.unix() < TIME_GAP_MIN_SEC) {
    errors.resultSettingEndTime = intl.formatMessage(messages.validResultSetEnd);
  }

  return errors;
};

@withRouter
@injectIntl
@withStyles(styles, { withTheme: true })
@connect((state) => ({
  initialValues: {
    outcomes: ['', ''],
  },
  txReturn: state.Graphql.get('txReturn'),
  walletEncrypted: state.App.get('walletEncrypted'),
  addressValidated: state.App.get('addressValidated'),
  walletUnlockedUntil: state.App.get('walletUnlockedUntil'),
  walletAddresses: state.App.get('walletAddresses'),
  createEventDialogVisible: state.App.get('createEventDialogVisible'),
  eventEscrowAmount: state.Topic.get('eventEscrowAmount'),
}), (dispatch) => ({
  createTopicTx: (
    name,
    outcomes,
    resultSetter,
    bettingStartTime,
    bettingEndTime,
    resultSettingStartTime,
    resultSettingEndTime,
    escrowAmount,
    creatorAddress,
  ) => dispatch(graphqlActions.createTopicTx(
    name,
    outcomes,
    resultSetter,
    bettingStartTime,
    bettingEndTime,
    resultSettingStartTime,
    resultSettingEndTime,
    escrowAmount,
    creatorAddress,
  )),
  toggleWalletUnlockDialog: (isVisible) => dispatch(appActions.toggleWalletUnlockDialog(isVisible)),
  toggleCreateEventDialog: (isVisible) => dispatch(appActions.toggleCreateEventDialog(isVisible)),
  getInsightTotals: () => dispatch(appActions.getInsightTotals()),
  validateAddress: (address) => dispatch(appActions.validateAddress(address)),
  changeFormFieldValue: (field, value) => dispatch(change(FORM_NAME, field, value)),
  untouchForm: (field) => dispatch(untouch(FORM_NAME, field)),
  setTxConfirmInfoAndCallback: (txDesc, txAmount, txToken, txInfo, confirmCallback) => dispatch(appActions.setTxConfirmInfoAndCallback(txDesc, txAmount, txToken, txInfo, confirmCallback)),
}))
@reduxForm({
  form: FORM_NAME,
  fields,
  validate,
})
export default class CreateEvent extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    walletEncrypted: PropTypes.bool.isRequired,
    addressValidated: PropTypes.bool.isRequired,
    walletUnlockedUntil: PropTypes.number.isRequired,
    walletAddresses: PropTypes.array.isRequired,
    txReturn: PropTypes.object,
    createTopicTx: PropTypes.func,
    getInsightTotals: PropTypes.func,
    validateAddress: PropTypes.func.isRequired,
    untouchForm: PropTypes.func.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    handleSubmit: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    changeFormFieldValue: PropTypes.func.isRequired,
    toggleWalletUnlockDialog: PropTypes.func.isRequired,
    toggleCreateEventDialog: PropTypes.func.isRequired,
    createEventDialogVisible: PropTypes.bool.isRequired,
    eventEscrowAmount: PropTypes.number,
    setTxConfirmInfoAndCallback: PropTypes.func.isRequired,
  }

  static defaultProps = {
    createTopicTx: undefined,
    txReturn: undefined,
    getInsightTotals: undefined,
    eventEscrowAmount: undefined,
  }

  state = {
    selectAddressDialogVisibility: false,
    notEnoughQtumError: {},
    hasEnoughQtum: true,
  }

  getAdjustedTime = (minIncrease) => (
    moment().add(minIncrease, 'm').format('YYYY-MM-DDTHH:mm')
  )

  validateTitleLength = (value) => {
    const { intl } = this.props;
    let hexString = _.isUndefined(value) ? '' : value;

    // Remove hex prefix for length validation
    hexString = Web3Utils.toHex(hexString).slice(2);
    if (hexString && hexString.length > MAX_LEN_EVENTNAME_HEX) {
      return intl.formatMessage(messages.nameLong);
    }

    return null;
  }

  validateResultSetterAddress = (value) => {
    const { intl, validateAddress } = this.props;

    if (!_.isUndefined(value)) {
      validateAddress(value);
    } else {
      return intl.formatMessage(messages.required);
    }

    return null;
  }

  submitCreateEvent = (values) => {
    const {
      eventEscrowAmount,
      createTopicTx,
    } = this.props;

    const {
      name,
      outcomes,
      resultSetter,
      bettingStartTime,
      bettingEndTime,
      resultSettingStartTime,
      resultSettingEndTime,
      creatorAddress,
    } = values;

    createTopicTx(
      name,
      outcomes,
      resultSetter,
      moment(bettingStartTime).utc().unix().toString(),
      moment(bettingEndTime).utc().unix().toString(),
      moment(resultSettingStartTime).utc().unix().toString(),
      moment(resultSettingEndTime).utc().unix().toString(),
      eventEscrowAmount,
      creatorAddress,
    );
    this.props.reset(FORM_NAME);
  }

  checkWalletAndConfirmAction = (values) => {
    const {
      walletEncrypted,
      walletUnlockedUntil,
      toggleWalletUnlockDialog,
      setTxConfirmInfoAndCallback,
      eventEscrowAmount,
      intl,
    } = this.props;

    if (doesUserNeedToUnlockWallet(walletEncrypted, walletUnlockedUntil)) {
      toggleWalletUnlockDialog(true);
    } else {
      const self = this;
      setTxConfirmInfoAndCallback(
        intl.formatMessage(messages.confirmCreateMsg),
        eventEscrowAmount,
        Token.Bot,
        {
          type: TransactionType.ApproveCreateEvent,
          token: Token.Bot,
          amount: eventEscrowAmount,
          optionIdx: undefined,
          topicAddress: undefined,
          oracleAddress: undefined,
          senderAddress: values.creatorAddress,
        },
        () => {
          self.submitCreateEvent(values);
        }
      );
    }
  }

  onSelectResultSetterAddress = () => {
    this.setState({
      selectAddressDialogVisibility: true,
    });
  }

  onSelectResultSetterAddressDialogClosed = (address) => {
    this.setState({
      selectAddressDialogVisibility: false,
    });

    this.props.changeFormFieldValue(ID_RESULT_SETTER, address);
    this.props.untouchForm(ID_RESULT_SETTER);
  }

  onEnter = () => {
    if (process.env.REACT_APP_ENV === 'dev') {
      this.props.changeFormFieldValue(ID_BETTING_START_TIME, this.getAdjustedTime(2));
      this.props.changeFormFieldValue(ID_BETTING_END_TIME, this.getAdjustedTime(4));
      this.props.changeFormFieldValue(ID_RESULT_SETTING_START_TIME, this.getAdjustedTime(4));
      this.props.changeFormFieldValue(ID_RESULT_SETTING_END_TIME, this.getAdjustedTime(6));
    } else {
      this.props.changeFormFieldValue(ID_BETTING_START_TIME, this.getAdjustedTime(15));
      this.props.changeFormFieldValue(ID_BETTING_END_TIME, this.getAdjustedTime(45));
      this.props.changeFormFieldValue(ID_RESULT_SETTING_START_TIME, this.getAdjustedTime(45));
      this.props.changeFormFieldValue(ID_RESULT_SETTING_END_TIME, this.getAdjustedTime(75));
    }
  }

  onClose = () => {
    this.props.toggleCreateEventDialog(false);
  }

  validateEnoughQTUM = () => {
    const totalQtum = _.sumBy(this.props.walletAddresses, ({ qtum }) => qtum);
    const hasEnoughQtum = totalQtum >= maxTransactionFee;
    const notEnoughQtumError = {
      id: 'str.notEnoughQtum',
      message: 'You don\'t have enough QTUM',
    };
    this.setState({ hasEnoughQtum, notEnoughQtumError });
  }

  componentWillMount() {
    this.props.getInsightTotals();
  }

  componentWillReceiveProps(nextProps) {
    this.validateEnoughQTUM();
    if (nextProps.txReturn) {
      this.onClose();
    }

    if (!_.isUndefined(nextProps.addressValidated)) {
      this.resultSetterField();
    }
  }

  resultSetterField() {
    const { intl: { formatMessage } } = this.props;
    return (
      <Field
        required
        fullWidth
        name={ID_RESULT_SETTER}
        placeholder={formatMessage(messages.resultSetterPlaceholder)}
        component={this.resultSetterTextField}
        validate={[this.validateResultSetterAddress]}
      />
    );
  }

  resultSetterTextField = ({ input, placeholder, startAdornmentLabel, meta: { touched, error }, ...custom }) => {
    const { intl, addressValidated } = this.props;
    let errorMsg = null;
    if (touched) {
      if (error) {
        errorMsg = error;
      } else if (!addressValidated) {
        errorMsg = intl.formatMessage(messages.invalidAddress);
      }
    }

    return (
      <FormControl fullWidth>
        <_TextField
          {...input}
          {...custom}
          fullWidth
          placeholder={placeholder}
          error={!_.isEmpty(errorMsg)}
        />
        {!_.isEmpty(errorMsg) && <FormHelperText error>{errorMsg}</FormHelperText>}
      </FormControl>
    );
  };

  render() {
    const {
      intl: { formatMessage },
      classes,
      walletAddresses,
      changeFormFieldValue,
      handleSubmit,
      submitting,
      createEventDialogVisible,
      eventEscrowAmount,
    } = this.props;
    const { hasEnoughQtum, notEnoughQtumError: { id, message } } = this.state;

    return (
      <Dialog fullWidth maxWidth="md" open={createEventDialogVisible && _.isNumber(eventEscrowAmount)} onEnter={this.onEnter} onClose={this.onClose}>
        <Form onSubmit={handleSubmit(this.checkWalletAndConfirmAction)}>
          <DialogContent>
            <Grid container>
              <Grid item xs={3}>
                <DialogTitle className={classes.title}>{formatMessage(messages.dialogTitle)}</DialogTitle>
              </Grid>
              <Grid item xs={9}>
                {!hasEnoughQtum && <EventWarning id={id} message={message} type="error" />}
              </Grid>
            </Grid>
            <div className={classes.importantNoteContainer}>
              <ImportantNote
                className={classes.createEscrowNote}
                heading={formatMessage(messages.escrowNoteTitle, { amount: eventEscrowAmount })}
                message={formatMessage(messages.escrowNoteDesc, { amount: eventEscrowAmount })}
              />
            </div>
          </DialogContent>
          <DialogContent>
            <Section title={messages.title}>
              <Grid item xs={12}>
                <Field
                  name={ID_NAME}
                  placeholder={formatMessage(messages.namePlaceholder)}
                  validate={[this.validateTitleLength]}
                  component={TextField}
                />
              </Grid>
            </Section>
            <Section title={messages.creator}>
              <CreateEventCreatorPicker name={ID_CREATOR_ADDRESS} eventEscrowAmount={eventEscrowAmount} changeFormFieldValue={changeFormFieldValue} />
            </Section>
            <Section title={messages.betStartTime}>
              <CreateEventDatePicker name={ID_BETTING_START_TIME} />
            </Section>
            <Section title={messages.betEndTime}>
              <CreateEventDatePicker name={ID_BETTING_END_TIME} />
            </Section>
            <Section title={messages.resultSetStartTime}>
              <CreateEventDatePicker name={ID_RESULT_SETTING_START_TIME} />
            </Section>
            <Section title={messages.resultSetEndTime}>
              <CreateEventDatePicker name={ID_RESULT_SETTING_END_TIME} />
            </Section>
            <Section title={messages.outcomes}>
              <CreateEventOutcomes name={ID_OUTCOMES} />
            </Section>
            <Section title={messages.resultSetter}>
              {this.resultSetterField()}
              <Button
                className={classes.inputButton}
                variant="raised"
                onClick={this.onSelectResultSetterAddress}
              >
                {formatMessage(messages.selectMyAddress)}
              </Button>
            </Section>
            <SelectAddressDialog
              dialogVisible={this.state.selectAddressDialogVisibility}
              walletAddresses={walletAddresses}
              onClosed={this.onSelectResultSetterAddressDialogClosed}
            />
          </DialogContent>
          <DialogActions className={classes.buttonContainer}>
            <Button color="primary" onClick={this.onClose}>
              <FormattedMessage id="str.cancel" defaultMessage="Cancel" />
            </Button>
            <Button type="submit" color="primary" disabled={submitting || !hasEnoughQtum} variant="raised">
              <FormattedMessage id="create.publish" defaultMessage="Publish" />
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    );
  }
}

const Section = injectIntl(withStyles(styles, { withTheme: true })(({ classes, title, children, intl }) => (
  <Grid container className={classes.sectionContainer}>
    <Grid item xs={3}>
      {intl.formatMessage(title)}
    </Grid>
    <Grid item xs={9}>
      {children}
    </Grid>
  </Grid>
)));

const TextField = ({ input, placeholder, startAdornmentLabel, meta: { touched, error }, ...custom }) => ( // eslint-disable-line
  <FormControl fullWidth>
    <_TextField
      {...input}
      {...custom}
      fullWidth
      placeholder={placeholder}
      error={Boolean(touched && error)}
      InputProps={{
        startAdornment: startAdornmentLabel && <InputAdornment position="start">{startAdornmentLabel}</InputAdornment>,
      }}
    />
    {touched && error && <FormHelperText error>{error}</FormHelperText>}
  </FormControl>
);
