/* eslint react/no-unused-prop-types: 0, react/no-unused-state: 0, prefer-destructuring: 0 */ // Disable "Do not use Array index in keys" for options since they dont have unique identifier

import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray, reduxForm, Form, formValueSelector } from 'redux-form';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import Select from 'material-ui/Select';
import Button from 'material-ui/Button';
import { FormControl, FormHelperText } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import _ from 'lodash';
import moment from 'moment';
import Web3Utils from 'web3-utils';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';

import SelectAddressDialog from '../../components/SelectAddressDialog/index';
import graphqlActions from '../../redux/Graphql/actions';
import appActions from '../../redux/App/actions';
import { calculateBlock } from '../../helpers/utility';
import { defaults } from '../../config/app';
import styles from './styles';

const MIN_OPTION_NUMBER = 2;
const MAX_OPTION_NUMBER = 10;
const MAX_LEN_EVENTNAME_HEX = 640;
const MAX_LEN_RESULT_HEX = 64;

const ID_BETTING_START_TIME = 'bettingStartTime';
const ID_BETTING_END_TIME = 'bettingEndTime';
const ID_RESULT_SETTING_START_TIME = 'resultSettingStartTime';
const ID_RESULT_SETTING_END_TIME = 'resultSettingEndTime';

const DEFAULT_PICKER_TIME = moment().format('YYYY-MM-DDTHH:mm');

const resultUuid = 2;

const messages = defineMessages({
  betStartBlockMsg: {
    id: 'create.betStartBlockMsg',
    defaultMessage: 'Betting Start Time cannot be empty',
  },
  betEndBlocksMsg: {
    id: 'create.betEndBlocksMsg',
    defaultMessage: 'Betting End Time cannot be empty',
  },
  resultSetStartBlockMsg: {
    id: 'create.resultSetStartBlockMsg',
    defaultMessage: 'Result Setting Start Time cannot be empty',
  },
  resultSetEndBlockMsg: {
    id: 'create.resultSetEndBlockMsg',
    defaultMessage: 'Result Setting End Time cannot be empty',
  },
  resultsMsg: {
    id: 'create.resultsMsg',
    defaultMessage: 'Result name cannot be empty.',
  },
  evtNotEmpty: {
    id: 'create.evtNotEmpty',
    defaultMessage: 'Event name cannot be empty.',
  },
  namePlaceholder: {
    id: 'create.namePlaceholder',
    defaultMessage: 'e.g. Who will be the next president of the United States?',
  },
  COnotEmpty: {
    id: 'create.COnotEmpty',
    defaultMessage: 'Centralized Oracle cannot be empty.',
  },
  dateTime: {
    id: 'create.dateTime',
    defaultMessage: 'Select Date & Time',
  },
  resultIndex: {
    id: 'create.resultIndex',
    defaultMessage: 'Result',
  },
  nameLong: {
    id: 'create.nameLong',
    defaultMessage: 'Event name is too long.',
  },
  validBetEnd: {
    id: 'create.validBetEnd',
    defaultMessage: 'Must be greater than Betting Start Time',
  },
  validResultSetStart: {
    id: 'create.validResultSetStart',
    defaultMessage: 'Must be greater than or equal to Betting End Time',
  },
  validResultSetEnd: {
    id: 'create.validResultSetEnd',
    defaultMessage: 'Must be greater than Result Setting Start Time',
  },
  resultTooLong: {
    id: 'create.resultTooLong',
    defaultMessage: 'Result name is too long.',
  },
  alertSuc: {
    id: 'create.alertSuc',
    defaultMessage: 'The transaction is broadcasted to blockchain. \n You can view details from below link ',
  },
  alertFail: {
    id: 'create.alertFail',
    defaultMessage: 'Oops, something went wrong',
  },
});

class CreateEvent extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    walletAddresses: PropTypes.array.isRequired,
    lastUsedAddress: PropTypes.string.isRequired,
    setLastUsedAddress: PropTypes.func.isRequired,
    walletEncrypted: PropTypes.bool.isRequired,
    walletUnlockedUntil: PropTypes.number.isRequired,
    txReturn: PropTypes.object,
    createTopicTx: PropTypes.func,
    getInsightTotals: PropTypes.func,
    history: PropTypes.object.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    syncBlockNum: PropTypes.number,
    averageBlockTime: PropTypes.number,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    bettingStartTime: PropTypes.string,
    bettingEndTime: PropTypes.string,
    resultSettingStartTime: PropTypes.string,
    resultSettingEndTime: PropTypes.string,
  };

  static defaultProps = {
    bettingStartTime: DEFAULT_PICKER_TIME,
    bettingEndTime: DEFAULT_PICKER_TIME,
    resultSettingStartTime: DEFAULT_PICKER_TIME,
    resultSettingEndTime: DEFAULT_PICKER_TIME,
    createTopicTx: undefined,
    txReturn: undefined,
    getInsightTotals: undefined,
    syncBlockNum: undefined,
    averageBlockTime: defaults.averageBlockTime,
  };

  state = {
    selectAddressDialogVisibility: false,
  };

  validateTitleLength = (value) => {
    let hexString = _.isUndefined(value) ? '' : value;

    // Remove hex prefix for length validation
    hexString = Web3Utils.toHex(hexString).slice(2);
    if (hexString && hexString.length > MAX_LEN_EVENTNAME_HEX) {
      return this.props.intl.formatMessage(messages.nameLong);
    }

    return null;
  };

  validateTimeAfterNow = (value) => {
    const valueTime = moment(value);
    const now = moment();

    if (_.isUndefined(valueTime) || now.unix() > valueTime.unix()) {
      return 'cannot be in the past';
    }

    return null;
  };

  validateBettingEndTime = (value) => {
    /*
    if (_.isUndefined(bettingStartTime) || value.unix() <= bettingStartTime.unix()) {
      return this.props.intl.formatMessage(messages.validBetEnd);
    }
    */
    console.log(value);

    return null;
  };

  validateResultSettingStartTime = (value) => {
    /*
    if (_.isUndefined(bettingEndTime) || value.unix() < bettingEndTime.unix()) {
      return this.props.intl.formatMessage(messages.validResultSetStart);
    }
    */
    console.log(value);

    return null;
  };

  validateResultSettingEndTime = (value) => {
    /*
    if (_.isUndefined(resultSettingStartTime) || value.unix() <= resultSettingStartTime.unix()) {
      return this.props.intl.formatMessage(messages.validResultSetEnd);
    }
    */
    console.log(value);

    return null;
  };

  validateResultLength = (value) => {
    let hexString = _.isUndefined(value) ? '' : value;

    // Remove hex prefix for length validation
    hexString = Web3Utils.toHex(hexString).slice(2);
    if (hexString && hexString.length > MAX_LEN_RESULT_HEX) {
      return this.props.intl.formatMessage(messages.resultTooLong);
    }

    return null;
  };

  submit = (values) => {
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

    this.props.createTopicTx(
      name,
      outcomes,
      resultSetter,
      moment(bettingStartTime).utc().unix().toString(),
      moment(bettingEndTime).utc().unix().toString(),
      moment(resultSettingStartTime).utc().unix().toString(),
      moment(resultSettingEndTime).utc().unix().toString(),
      creatorAddress,
    );
  };

  componentWillMount() {
    this.props.getInsightTotals();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.txReturn) {
      this.setState({ open: false });
    }
  }

  renderTextField = ({
    input,
    placeholder,
    startAdornmentLabel,
    meta: { touched, error },
    ...custom
  }) => (
    <FormControl fullWidth>
      <TextField
        {...input}
        {...custom}
        fullWidth
        placeholder={placeholder}
        error={Boolean(touched && error)}
        InputProps={{
          startAdornment: startAdornmentLabel ? <InputAdornment position="start">{startAdornmentLabel}</InputAdornment> : null,
        }}
      />
      {
        touched && error ?
          <FormHelperText error>{error}</FormHelperText> : null
      }
    </FormControl>
  );

  renderDateTimePicker = ({
    input,
    meta: { touched, error },
    ...custom
  }) => {
    // calculate block num if input value is not empty
    let blockNum = '';

    if (!input.value || input.value !== '') {
      const {
        syncBlockNum,
        averageBlockTime,
      } = this.props;

      const localDate = moment(input.value).local();
      blockNum = calculateBlock(syncBlockNum, localDate, averageBlockTime);
    }

    return (
      <Grid item container xs={12}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <TextField
              {...input}
              {...custom}
              fullWidth
              type="datetime-local"
              error={Boolean(touched && error)}
            />
            {
              touched && error ?
                <FormHelperText error>{error}</FormHelperText> : null
            }
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <TextField
            fullWidth
            disabled
            placeholder="Block Number"
            value={blockNum ? `Block: ${blockNum}` : ''}
          />
        </Grid>
      </Grid>
    );
  };

  renderOutcome = (outcome, index, fields) => {
    const { classes } = this.props;

    return (
      <li key={`outcome-${index}`} className={classes.outcomeWrapper}>
        <Field
          fullWidth
          name={outcome}
          placeholder="Outcome Name"
          component={this.renderTextField}
          validate={[this.validateResultLength]}
          startAdornmentLabel={`#${index + 1}`}
        />
        {
          fields.length > 2 ?
            (<i
              className={classNames(
                classes.removeOutcome,
                'icon', 'iconfont', 'icon-close'
              )}
              onClick={() => {
                if (fields.length > 2) {
                  fields.remove(index);
                }
              }}
            >
            </i>) : null
        }
      </li>
    );
  };

  renderOutcomeList = ({ fields }) => (
    <ul>
      {fields.map(this.renderOutcome)}
      {
        fields.length < 10 ?
          (<Button
            color="primary"
            onClick={() => {
              if (fields.length < 10) {
                fields.push('');
              }
            }}
          >
            + Add Result
          </Button>) : null
      }
    </ul>
  );

  renderAddressSelector = ({
    input,
    meta: { touched, error },
    ...custom
  }) => (
    <Select
      {...input}
      {...custom}
      fullWidth
      value={this.props.lastUsedAddress}
    >
      {this.props.walletAddresses.map((item, index) => (
        <MenuItem key={item.address} value={item.address}>
          {`${item.address}`}
          {` (${item.qtum ? item.qtum.toFixed(2) : 0} QTUM, ${item.bot ? item.bot.toFixed(2) : 0} BOT)`}
        </MenuItem>
      ))}
    </Select>
  );

  onDatePickerChange = (event, newValue, previousValue, name) => {
    const {
      syncBlockNum,
      averageBlockTime,
    } = this.props;

    const localDate = moment(newValue).local();
    const block = calculateBlock(syncBlockNum, localDate, averageBlockTime);
    console.log(block);

    switch (name) {
      case ID_BETTING_START_TIME:
        this.setState({
          bettingStartBlock: block,
        });
        break;
      case ID_BETTING_END_TIME:
        this.setState({
          bettingEndBlock: block,
        });
        break;
      case ID_RESULT_SETTING_START_TIME:
        this.setState({
          resultSettingStartBlock: block,
        });
        break;
      case ID_RESULT_SETTING_END_TIME:
        this.setState({
          resultSettingEndBlock: block,
        });
        break;
      default:
        throw new Error(`Unhandled block number ${name}`);
    }
  };

  onCreatorAddressChange = (event, newValue, previousValue, name) => {
    this.props.setLastUsedAddress(newValue);
  };

  render() {
    const {
      handleSubmit,
      submitting,
      lastUsedAddress,
    } = this.props;

    return (
      <Dialog
        fullWidth
        maxWidth="md"
        open={this.props.open}
        onClose={this.props.onClose}
      >
        <Form onSubmit={handleSubmit(this.submit)}>
          <DialogTitle>Create an Event</DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid item xs={3}>
                TITLE
              </Grid>
              <Grid item container xs={9}>
                <Grid item xs={12}>
                  <Field
                    name="name"
                    placeholder="Who will be the next America president in 2020?"
                    validate={[this.validateTitleLength]}
                    component={this.renderTextField}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                PREDICTION START TIME
              </Grid>
              <Grid item container xs={9}>
                <Field
                  onChange={this.onDatePickerChange}
                  name={ID_BETTING_START_TIME}
                  component={this.renderDateTimePicker}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                PREDICTION END TIME
              </Grid>
              <Grid item container xs={9}>
                <Field
                  onChange={this.onDatePickerChange}
                  name={ID_BETTING_END_TIME}
                  component={this.renderDateTimePicker}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                SET RESULT START TIME
              </Grid>
              <Grid item container xs={9}>
                <Field
                  onChange={this.onDatePickerChange}
                  name={ID_RESULT_SETTING_START_TIME}
                  component={this.renderDateTimePicker}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                SET RESULT END TIME
              </Grid>
              <Grid item container xs={9}>
                <Field
                  onChange={this.onDatePickerChange}
                  name={ID_RESULT_SETTING_END_TIME}
                  component={this.renderDateTimePicker}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                OUTCOMES
              </Grid>
              <Grid item xs={9}>
                <FieldArray name="outcomes" component={this.renderOutcomeList} />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                RESULT SETTER
              </Grid>
              <Grid item xs={9}>
                <Field
                  required
                  fullWidth
                  name="resultSetter"
                  placeholder="Enter the address of result setter or select your own address by clicking the icon on the right"
                  component={this.renderTextField}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                WALLET ADDRESS
              </Grid>
              <Grid item xs={9}>
                <Field
                  fullWidth
                  name="creatorAddress"
                  onChange={this.onCreatorAddressChange}
                  component={this.renderAddressSelector}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.props.onClose}>
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={submitting} variant="raised">
              Publish
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    );
  }
}

const selector = formValueSelector('createEvent');

const mapStateToProps = (state) => ({
  initialValues: {
    bettingStartTime: DEFAULT_PICKER_TIME,
    bettingEndTime: DEFAULT_PICKER_TIME,
    resultSettingStartTime: DEFAULT_PICKER_TIME,
    resultSettingEndTime: DEFAULT_PICKER_TIME,
    outcomes: ['', ''],
  },
  bettingStartTime: selector(state, 'bettingStartTime'),
  bettingEndTime: selector(state, 'bettingEndTime'),
  resultSettingStartTime: selector(state, 'resultSettingStartTime'),
  resultSettingEndTime: selector(state, 'resultSettingEndTime'),
  txReturn: state.Graphql.get('txReturn'),
  walletAddresses: state.App.get('walletAddresses'),
  lastUsedAddress: state.App.get('lastUsedAddress'),
  walletEncrypted: state.App.get('walletEncrypted'),
  walletUnlockedUntil: state.App.get('walletUnlockedUntil'),
  syncBlockNum: state.App.get('syncBlockNum'),
  averageBlockTime: state.App.get('averageBlockTime'),
});

function mapDispatchToProps(dispatch) {
  return {
    createTopicTx: (
      name,
      results,
      centralizedOracle,
      bettingStartTime,
      bettingEndTime,
      resultSettingStartTime,
      resultSettingEndTime,
      senderAddress
    ) => dispatch(graphqlActions.createTopicTx(
      name,
      results,
      centralizedOracle,
      bettingStartTime,
      bettingEndTime,
      resultSettingStartTime,
      resultSettingEndTime,
      senderAddress
    )),
    toggleWalletUnlockDialog: (isVisible) => dispatch(appActions.toggleWalletUnlockDialog(isVisible)),
    getInsightTotals: () => dispatch(appActions.getInsightTotals()),
    setLastUsedAddress: (address) => dispatch(appActions.setLastUsedAddress(address)),
  };
}

const validate = (values) => {
  const errors = {};

  const requiredFields = [
    'name',
    'bettingStartTime',
    'bettingEndTime',
    'resultSettingStartTime',
    'resultSettingEndTime',
    'resultSetter',
  ];

  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = 'Required';
    }
  });

  const bettingStartTime = moment(values.bettingStartTime);
  const bettingEndTime = moment(values.bettingEndTime);
  const resultSettingStartTime = moment(values.resultSettingStartTime);
  const resultSettingEndTime = moment(values.resultSettingEndTime);
  const now = moment();

  if (now.unix() > bettingStartTime.unix()) {
    errors.bettingStartTime = 'cannot be in the past';
  }

  if (bettingStartTime.unix() > bettingEndTime.unix()) {
    errors.bettingEndTime = 'bet end time cannot be before start time';
  }

  if (bettingEndTime.unix() > resultSettingStartTime.unix()) {
    errors.resultSettingStartTime = 'result start time cannot be before bet end time';
  }

  if (resultSettingStartTime.unix() > resultSettingEndTime.unix()) {
    errors.resultSettingEndTime = 'result end time cannot be before start time';
  }

  return errors;
};

// Decorate with redux-form
const createEventForm = reduxForm({
  form: 'createEvent',
  validate,
})(CreateEvent);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(withStyles(styles, { withTheme: true })(createEventForm))));
