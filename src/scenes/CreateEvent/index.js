import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import { Button, withStyles, Typography } from '@material-ui/core';
import { Clear, Create } from '@material-ui/icons';
import { FormattedMessage, injectIntl, defineMessages } from 'react-intl';
import { EventWarning as _EventWarning, ImportantNote, Loading, BackButton, PageContainer,
  ContentContainer } from 'components';
import { EventWarningType } from 'constants';
import styles from './styles';
import Title from './Title';
import PredictionPeriod from './PredictionPeriod';
import ResultSetPeriod from './ResultSetPeriod';
import Outcomes from './Outcomes';
import ArbitrationRewardSlider from './ArbitrationRewardSlider';
import ArbitrationOptionSelector from './ArbitrationOptionSelector';

const messages = defineMessages({
  createEscrowNoteTitleMsg: {
    id: 'create.escrowNoteTitle',
    defaultMessage: '{amount} NBOT Escrow',
  },
  createEscrowNoteDescMsg: {
    id: 'create.escrowNoteDesc',
    defaultMessage: 'You will need to deposit {amount} NBOT in escrow to create an event. You can withdraw it when the event is in the Withdraw stage.',
  },
  pleaseWait: {
    id: 'str.pleasewait',
    defaultMessage: 'Please Wait',
  },
});

@injectIntl
@withStyles(styles, { withTheme: true })
@withRouter
@inject('store')
@observer
export default class CreateEvent extends Component {
  componentDidMount() {
    this.props.store.createEvent.close();
    this.props.store.createEvent.init();
  }

  render() {
    const {
      store: {
        createEvent: { loaded },
      },
      classes,
    } = this.props;

    if (!loaded) {
      return <Loading text={messages.pleaseWait} />;
    }

    return (
      <Fragment>
        <BackButton />
        <PageContainer>
          <ContentContainer noSideBar className={classes.createContainer}>
            <Typography variant="h4" className={classes.title}>
              <FormattedMessage id="str.createEvent" defaultMessage="Create Event" />
            </Typography>
            <EscrowAmountNote />
            <EventWarning />
            <Title />
            <Outcomes />
            <PredictionPeriod />
            <ResultSetPeriod />
            <ArbitrationRewardSlider />
            <ArbitrationOptionSelector />
            <div className={classes.footer}>
              <div className={classes.buttons}>
                <CancelButton />
                <PublishButton />
              </div>
            </div>
          </ContentContainer>
        </PageContainer>
      </Fragment>
    );
  }
}

const EventWarning = inject('store')(observer(({ store: { createEvent: { hasEnoughFee, warning } } }) => (
  !hasEnoughFee && <_EventWarning id={warning.id} message={warning.message} type={EventWarningType.ERROR} />
)));

const EscrowAmountNote = injectIntl(withStyles(styles)(inject('store')(observer(({ classes, intl, store: { createEvent: { escrowAmount } } }) => {
  const heading = intl.formatMessage(messages.createEscrowNoteTitleMsg, { amount: escrowAmount });
  const message = intl.formatMessage(messages.createEscrowNoteDescMsg, { amount: escrowAmount });
  return <ImportantNote className={classes.escrowAmountNote} heading={heading} message={message} />;
}))));

const CancelButton = withStyles(styles)(inject('store')(({ classes, store: { createEvent } }) => (
  <Button className={classes.cancelButton} onClick={createEvent.close} variant="contained" size="small">
    <Clear className={classes.buttonIcon} />
    <FormattedMessage id="str.cancel" defaultMessage="Cancel" />
  </Button>
)));

const PublishButton = withStyles(styles)(withRouter(inject('store')(observer(({ classes, store: { createEvent }, ...props }) => (
  <Button
    onClick={() => createEvent.submit(props)}
    disabled={createEvent.submitting || !createEvent.hasEnoughFee}
    color="primary"
    variant="contained"
    size="small"
  >
    <Create className={classes.buttonIcon} />
    <FormattedMessage id="create.publish" defaultMessage="Publish" />
  </Button>
)))));
