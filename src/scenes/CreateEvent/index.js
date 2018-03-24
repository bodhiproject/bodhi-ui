import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import _ from 'lodash';
import moment from 'moment';
import Web3Utils from 'web3-utils';
import { Field, FieldArray, reduxForm, Form, formValueSelector, change } from 'redux-form';
import Dialog, { DialogActions, DialogContent, DialogTitle } from 'material-ui/Dialog';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import Button from 'material-ui/Button';
import { FormControl, FormHelperText } from 'material-ui/Form';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import { withStyles } from 'material-ui/styles';

import ImportantNote from '../../components/ImportantNote/index';
import CreateEventDatePicker from './components/CreateEventDatePicker/index';
import CreateEventOutcomes from './components/CreateEventOutcomes/index';
import CreateEventCreatorPicker from './components/CreateEventCreatorPicker/index';
import SelectAddressDialog from '../../components/SelectAddressDialog/index';
import graphqlActions from '../../redux/Graphql/actions';
import appActions from '../../redux/App/actions';
import styles from './styles';

const MAX_LEN_EVENTNAME_HEX = 640;

const ID_BETTING_START_TIME = 'bettingStartTime';
const ID_BETTING_END_TIME = 'bettingEndTime';
const ID_RESULT_SETTING_START_TIME = 'resultSettingStartTime';
const ID_RESULT_SETTING_END_TIME = 'resultSettingEndTime';
const ID_NAME = 'name';
const ID_OUTCOMES = 'outcomes';
const ID_RESULT_SETTER = 'resultSetter';
const ID_CREATOR_ADDRESS = 'creatorAddress';

const TIME_GAP_MIN_SEC = 30 * 60;

// default date picker to time 10 minutes from now
const DEFAULT_PICKER_TIME_15_MIN = moment().add(15, 'm').format('YYYY-MM-DDTHH:mm');
const DEFAULT_PICKER_TIME_45_MIN = moment().add(45, 'm').format('YYYY-MM-DDTHH:mm');
const DEFAULT_PICKER_TIME_75_MIN = moment().add(75, 'm').format('YYYY-MM-DDTHH:mm');

const FORM_NAME = 'createEvent';

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
    defaultMessage: 'BOT Escrow',
  },
  escrowNoteDescPre: {
    id: 'create.escrowNoteDescPre',
    defaultMessage: 'You will need to pay',
  },
  escrowNoteDescAfter: {
    id: 'create.escrowNoteDescAfter',
    defaultMessage: 'BOT as escrow in order to create an event.',
  },
});

const selector = formValueSelector(FORM_NAME);

@withRouter
class CreateEvent extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    fields: PropTypes.array.isRequired,
    walletAddresses: PropTypes.array.isRequired,
    txReturn: PropTypes.object,
    createTopicTx: PropTypes.func,
    getInsightTotals: PropTypes.func,
    history: PropTypes.object.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
    handleSubmit: PropTypes.func.isRequired,
    submitting: PropTypes.bool.isRequired,
    changeFormFieldValue: PropTypes.func.isRequired,
    toggleCreateEventDialog: PropTypes.func.isRequired,
    createEventDialogVisible: PropTypes.bool.isRequired,
    eventEscrowAmount: PropTypes.number,
  };

  static defaultProps = {
    createTopicTx: undefined,
    txReturn: undefined,
    getInsightTotals: undefined,
    eventEscrowAmount: undefined,
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

  submitCreateEvent = (values) => {
    const { eventEscrowAmount } = this.props;
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
      eventEscrowAmount,
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

  onSelectResultSetterAddress = () => {
    this.setState({
      selectAddressDialogVisibility: true,
    });
  };

  onSelectResultSetterAddressDialogClosed = (address) => {
    this.setState({
      selectAddressDialogVisibility: false,
    });

    this.props.changeFormFieldValue(ID_RESULT_SETTER, address);
  };

  onClose = () => {
    this.props.toggleCreateEventDialog(false);
  };

  componentWillMount() {
    this.props.getInsightTotals();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.txReturn) {
      this.onClose();
    }
  }

  render() {
    const {
      intl,
      classes,
      walletAddresses,
      changeFormFieldValue,
      handleSubmit,
      submitting,
      createEventDialogVisible,
      eventEscrowAmount,
    } = this.props;

    return (
      <Dialog
        fullWidth
        maxWidth="md"
        open={createEventDialogVisible && _.isNumber(eventEscrowAmount)}
        onClose={this.onClose}
      >
        <Form onSubmit={handleSubmit(this.submitCreateEvent)}>
          <DialogTitle>{intl.formatMessage(messages.dialogTitle)}</DialogTitle>
          <DialogContent>
            <div className={classes.importantNoteContainer}>
              <ImportantNote
                className={classes.createEscrowNote}
                heading={`${eventEscrowAmount} ${intl.formatMessage(messages.escrowNoteTitle)}`}
                message={`${intl.formatMessage(messages.escrowNoteDescPre)} ${eventEscrowAmount} ${intl.formatMessage(messages.escrowNoteDescAfter)}`}
              />
            </div>
            <Grid container>
              <Grid item xs={3}>
                {intl.formatMessage(messages.creator)}
              </Grid>
              <Grid item xs={9}>
                <CreateEventCreatorPicker name={ID_CREATOR_ADDRESS} eventEscrowAmount={eventEscrowAmount} changeFormFieldValue={changeFormFieldValue} />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                {intl.formatMessage(messages.title)}
              </Grid>
              <Grid item container xs={9}>
                <Grid item xs={12}>
                  <Field
                    name={ID_NAME}
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
                <CreateEventDatePicker name={ID_BETTING_START_TIME} />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                {intl.formatMessage(messages.betEndTime)}
              </Grid>
              <Grid item container xs={9}>
                <CreateEventDatePicker name={ID_BETTING_END_TIME} />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                {intl.formatMessage(messages.resultSetStartTime)}
              </Grid>
              <Grid item container xs={9}>
                <CreateEventDatePicker name={ID_RESULT_SETTING_START_TIME} />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                {intl.formatMessage(messages.resultSetEndTime)}
              </Grid>
              <Grid item container xs={9}>
                <CreateEventDatePicker name={ID_RESULT_SETTING_END_TIME} />
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={3}>
                {intl.formatMessage(messages.outcomes)}
              </Grid>
              <Grid item xs={9}>
                <CreateEventOutcomes name={ID_OUTCOMES} />
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
                  name={ID_RESULT_SETTER}
                  placeholder={intl.formatMessage(messages.resultSetterPlaceholder)}
                  component={this.renderTextField}
                />
                <Button
                  className={classes.inputButton}
                  variant="raised"
                  onClick={this.onSelectResultSetterAddress}
                >
                  {intl.formatMessage(messages.selectMyAddress)}
                </Button>
              </Grid>
            </Grid>
            <SelectAddressDialog
              dialogVisible={this.state.selectAddressDialogVisibility}
              walletAddresses={walletAddresses}
              onClosed={this.onSelectResultSetterAddressDialogClosed}
            />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.onClose}>
              <FormattedMessage id="str.cancel" defaultMessage="Cancel" />
            </Button>
            <Button type="submit" color="primary" disabled={submitting} variant="raised">
              <FormattedMessage id="create.publish" defaultMessage="Publish" />
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    );
  }
}

const mapStateToProps = (state) => ({
  initialValues: {
    bettingStartTime: DEFAULT_PICKER_TIME_15_MIN,
    bettingEndTime: DEFAULT_PICKER_TIME_45_MIN,
    resultSettingStartTime: DEFAULT_PICKER_TIME_45_MIN,
    resultSettingEndTime: DEFAULT_PICKER_TIME_75_MIN,
    outcomes: ['', ''],
  },
  txReturn: state.Graphql.get('txReturn'),
  walletAddresses: state.App.get('walletAddresses'),
  createEventDialogVisible: state.App.get('createEventDialogVisible'),
  eventEscrowAmount: state.Topic.get('eventEscrowAmount'),
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
    toggleCreateEventDialog: (isVisible) => dispatch(appActions.toggleCreateEventDialog(isVisible)),
    getInsightTotals: () => dispatch(appActions.getInsightTotals()),
    changeFormFieldValue: (field, value) => dispatch(change(FORM_NAME, field, value)),
  };
}

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

// decorate with redux-form
const createEventForm = reduxForm({
  form: FORM_NAME,
  fields,
  validate,
})(CreateEvent);

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles, { withTheme: true })(createEventForm)));
