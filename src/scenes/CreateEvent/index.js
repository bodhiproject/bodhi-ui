import React from 'react';
import PropTypes from 'prop-types';
import { Field, FieldArray, reduxForm, Form, formValueSelector, change } from 'redux-form';
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

// default date picker to time 10 minutes from now
const DEFAULT_PICKER_TIME = moment().add(10, 'm').format('YYYY-MM-DDTHH:mm');

const FORM_NAME = 'createEvent';

const messages = defineMessages({
  required: {
    id: 'create.required',
    defaultMessage: 'Required',
  },
  datePast: {
    id: 'create.datePast',
    defaultMessage: 'Cannot be in the past',
  },
  title: {
    id: 'create.title',
    defaultMessage: 'Title',
  },
  namePlaceholder: {
    id: 'create.namePlaceholder',
    defaultMessage: 'e.g. Who will be the next president of the United States?',
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
  cancel: {
    id: 'str.cancel',
    defaultMessage: 'Cancel',
  },
  publish: {
    id: 'create.publish',
    defaultMessage: 'Publish',
  },
  creator: {
    id: 'str.creator',
    defaultMessage: 'Creator',
  },
  outcomes: {
    id: 'str.outcomes',
    defaultMessage: 'Outcomes',
  },
  addOutcome: {
    id: 'create.addOutcome',
    defaultMessage: 'Add Outcome',
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
  outcomeName: {
    id: 'create.outcomeName',
    defaultMessage: 'Outcome Name',
  },
});

const selector = formValueSelector(FORM_NAME);

class CreateEvent extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    fields: PropTypes.array.isRequired,
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    walletAddresses: PropTypes.array.isRequired,
    lastUsedAddress: PropTypes.string.isRequired,
    setLastUsedAddress: PropTypes.func.isRequired,
    txReturn: PropTypes.object,
    createTopicTx: PropTypes.func,
    getInsightTotals: PropTypes.func,
    history: PropTypes.object.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    syncBlockNum: PropTypes.number,
    averageBlockTime: PropTypes.number,
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    changeFormFieldValue: PropTypes.func.isRequired,
  };

  static defaultProps = {
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
    const { intl } = this.props;
    let hexString = _.isUndefined(value) ? '' : value;

    // Remove hex prefix for length validation
    hexString = Web3Utils.toHex(hexString).slice(2);
    if (hexString && hexString.length > MAX_LEN_EVENTNAME_HEX) {
      return intl.formatMessage(messages.nameLong);
    }

    return null;
  };

  validateTimeAfterNow = (value) => {
    const { intl } = this.props;
    const valueTime = moment(value);
    const now = moment();

    if (_.isUndefined(valueTime) || now.unix() > valueTime.unix()) {
      return intl.formatMessage(messages.datePast);
    }

    return null;
  };

  validateResultLength = (value) => {
    const { intl } = this.props;

    if (!value) {
      return intl.formatMessage(messages.required);
    }

    let hexString = _.isUndefined(value) ? '' : value;

    // Remove hex prefix for length validation
    hexString = Web3Utils.toHex(hexString).slice(2);
    if (hexString && hexString.length > MAX_LEN_RESULT_HEX) {
      return intl.formatMessage(messages.resultTooLong);
    }

    return null;
  };

  submitCreateEvent = (values) => {
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
    const { classes, intl } = this.props;

    return (
      <li key={`outcome-${index}`} className={classes.outcomeWrapper}>
        <Field
          fullWidth
          name={outcome}
          placeholder={intl.formatMessage(messages.outcomeName)}
          component={this.renderTextField}
          validate={[this.validateResultLength]}
          startAdornmentLabel={`#${index + 1}`}
        />
        {
          fields.length > MIN_OPTION_NUMBER ?
            (<i
              className={classNames(
                classes.removeOutcome,
                'icon', 'iconfont', 'icon-close'
              )}
              onClick={() => {
                if (fields.length > MIN_OPTION_NUMBER) {
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
        fields.length < MAX_OPTION_NUMBER ?
          (<Button
            className={this.props.classes.inputButton}
            variant="raised"
            onClick={() => {
              if (fields.length < MAX_OPTION_NUMBER) {
                fields.push('');
              }
            }}
          >
            + {this.props.intl.formatMessage(messages.addOutcome)}
          </Button>) : null
      }
    </ul>
  );

  renderCreatorAddressSelector = ({
    input,
    meta: { touched, error },
    ...custom
  }) => {
    if (!input.value || input.value === '') {
      this.props.changeFormFieldValue('creatorAddress', this.props.lastUsedAddress);
    }

    return (<Select
      {...input}
      {...custom}
      fullWidth
    >
      {this.props.walletAddresses.map((item, index) => (
        <MenuItem key={item.address} value={item.address}>
          {`${item.address}`}
          {` (${item.qtum ? item.qtum.toFixed(2) : 0} QTUM, ${item.bot ? item.bot.toFixed(2) : 0} BOT)`}
        </MenuItem>
      ))}
    </Select>);
  };

  onCreatorAddressChange = (event, newValue, previousValue, name) => {
    this.props.setLastUsedAddress(newValue);
  };

  onSelectResultSetterAddress = () => {
    this.setState({
      selectAddressDialogVisibility: true,
    });
  };

  onSelectResultSetterAddressDialogClosed = (address) => {
    this.setState({
      selectAddressDialogVisibility: false,
    });

    this.props.changeFormFieldValue('resultSetter', address);
  };

  componentWillMount() {
    this.props.getInsightTotals();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.txReturn) {
      this.props.onClose();
    }
  }

  render() {
    const {
      classes,
      open,
      onClose,
      walletAddresses,
      handleSubmit,
      submitting,
      lastUsedAddress,
      intl,
    } = this.props;

    return (
      <Dialog
        fullWidth
        maxWidth="md"
        open={open}
        onClose={onClose}
      >
        <Form onSubmit={handleSubmit(this.submitCreateEvent)}>
          <DialogTitle>Create an Event</DialogTitle>
          <DialogContent>
            <Grid container>
              <Grid item xs={3}>
                {intl.formatMessage(messages.title)}
              </Grid>
              <Grid item container xs={9}>
                <Grid item xs={12}>
                  <Field
                    name="name"
                    placeholder={intl.formatMessage(messages.namePlaceholder)}
                    validate={[this.validateTitleLength]}
                    component={this.renderTextField}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                {intl.formatMessage(messages.betStartTime)}
              </Grid>
              <Grid item container xs={9}>
                <Field
                  name={ID_BETTING_START_TIME}
                  validate={[this.validateTimeAfterNow]}
                  component={this.renderDateTimePicker}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                {intl.formatMessage(messages.betEndTime)}
              </Grid>
              <Grid item container xs={9}>
                <Field
                  validate={[this.validateTimeAfterNow]}
                  name={ID_BETTING_END_TIME}
                  component={this.renderDateTimePicker}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                {intl.formatMessage(messages.resultSetStartTime)}
              </Grid>
              <Grid item container xs={9}>
                <Field
                  validate={[this.validateTimeAfterNow]}
                  name={ID_RESULT_SETTING_START_TIME}
                  component={this.renderDateTimePicker}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                {intl.formatMessage(messages.resultSetEndTime)}
              </Grid>
              <Grid item container xs={9}>
                <Field
                  validate={[this.validateTimeAfterNow]}
                  name={ID_RESULT_SETTING_END_TIME}
                  component={this.renderDateTimePicker}
                />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                {intl.formatMessage(messages.outcomes)}
              </Grid>
              <Grid item xs={9}>
                <FieldArray name="outcomes" component={this.renderOutcomeList} />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                {intl.formatMessage(messages.resultSetter)}
              </Grid>
              <Grid item xs={9}>
                <Field
                  required
                  fullWidth
                  name="resultSetter"
                  placeholder="Enter the address of result setter or select your own address"
                  component={this.renderTextField}
                />
                <Button
                  className={classes.inputButton}
                  variant="raised"
                  onClick={this.onSelectResultSetterAddress}
                >
                  Select My Address
                </Button>
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                {intl.formatMessage(messages.creator)}
              </Grid>
              <Grid item xs={9}>
                <Field
                  fullWidth
                  name="creatorAddress"
                  onChange={this.onCreatorAddressChange}
                  component={this.renderCreatorAddressSelector}
                />
              </Grid>
            </Grid>
            <SelectAddressDialog
              dialogVisible={this.state.selectAddressDialogVisibility}
              walletAddresses={walletAddresses}
              onClosed={this.onSelectResultSetterAddressDialogClosed}
            />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={onClose}>
              {intl.formatMessage(messages.cancel)}
            </Button>
            <Button type="submit" color="primary" disabled={submitting} variant="raised">
              {intl.formatMessage(messages.publish)}
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    );
  }
}

const mapStateToProps = (state) => ({
  initialValues: {
    bettingStartTime: DEFAULT_PICKER_TIME,
    bettingEndTime: DEFAULT_PICKER_TIME,
    resultSettingStartTime: DEFAULT_PICKER_TIME,
    resultSettingEndTime: DEFAULT_PICKER_TIME,
    outcomes: ['', ''],
  },
  txReturn: state.Graphql.get('txReturn'),
  walletAddresses: state.App.get('walletAddresses'),
  lastUsedAddress: state.App.get('lastUsedAddress'),
  syncBlockNum: state.App.get('syncBlockNum'),
  averageBlockTime: state.App.get('averageBlockTime'),
});

function mapDispatchToProps(dispatch) {
  return {
    createTopicTx: (
      name,
      outcomes,
      resultSetter,
      bettingStartTime,
      bettingEndTime,
      resultSettingStartTime,
      resultSettingEndTime,
      creatorAddress,
    ) => dispatch(graphqlActions.createTopicTx(
      name,
      outcomes,
      resultSetter,
      bettingStartTime,
      bettingEndTime,
      resultSettingStartTime,
      resultSettingEndTime,
      creatorAddress,
    )),
    getInsightTotals: () => dispatch(appActions.getInsightTotals()),
    setLastUsedAddress: (address) => dispatch(appActions.setLastUsedAddress(address)),
    changeFormFieldValue: (field, value) => dispatch(change(FORM_NAME, field, value)),
  };
}

const validate = (values, props) => {
  const { intl } = props;

  const errors = {};

  // check required fields
  const requiredFields = [
    'name',
    'resultSetter',
    'creatorAddress',
    ID_BETTING_START_TIME,
    ID_BETTING_END_TIME,
    ID_RESULT_SETTING_START_TIME,
    ID_RESULT_SETTING_END_TIME,
  ];
  requiredFields.forEach((field) => {
    if (!values[field]) {
      errors[field] = intl.formatMessage(messages.required);
    }
  });

  // check dates
  const bettingStartTime = moment(values.bettingStartTime);
  const bettingEndTime = moment(values.bettingEndTime);
  const resultSettingStartTime = moment(values.resultSettingStartTime);
  const resultSettingEndTime = moment(values.resultSettingEndTime);

  if (bettingStartTime.unix() > bettingEndTime.unix()) {
    errors.bettingEndTime = intl.formatMessage(messages.validBetEnd);
  }

  if (bettingEndTime.unix() > resultSettingStartTime.unix()) {
    errors.resultSettingStartTime = intl.formatMessage(messages.validResultSetStart);
  }

  if (resultSettingStartTime.unix() > resultSettingEndTime.unix()) {
    errors.resultSettingEndTime = intl.formatMessage(messages.validResultSetEnd);
  }

  return errors;
};

// decorate with redux-form
const createEventForm = reduxForm({
  form: FORM_NAME,
  fields: [
    'name',
    'outcomes',
    'resultSetter',
    'creatorAddress',
    ID_BETTING_START_TIME,
    ID_BETTING_END_TIME,
    ID_RESULT_SETTING_START_TIME,
    ID_RESULT_SETTING_END_TIME,
  ],
  validate,
})(CreateEvent);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(injectIntl(withStyles(styles, { withTheme: true })(createEventForm))));
