import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import { Grid, Card, CardContent, withStyles, Typography } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { Token } from 'constants';
import styles from './styles';
import { CenteredDiv } from '../TransactionHistory';
import { getTimeString } from '../../../../helpers';
import { EXPLORER } from '../../../../network/routes';
import InfiniteScroll from '../../../../components/InfiniteScroll';

const messages = defineMessages({
  emptyTxHistoryMsg: {
    id: 'str.emptyResultSetHistory',
    defaultMessage: 'There are no previous results for now.',
  },
  strPendingMsg: {
    id: 'str.pending',
    defaultMessage: 'Pending',
  },
});

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class EventResultHistory extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    resultSetsHistory: PropTypes.array.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  };

  renderCardString = (resultSet, classes) => {
    const { store: { naka } } = this.props;
    const { eventRound, txSender } = resultSet;
    let { resultName } = resultSet;
    if (resultName.length > 20) resultName = `${resultName.slice(0, 6)}...${resultName.slice(-6)}`;
    if (eventRound === 0) {
      return (
        <Fragment>
          {(naka.account && naka.account.toLowerCase() === txSender && 'You') || `${txSender.slice(0, 6)}...${txSender.slice(-6)}`}
          <span className={classes.bold}> Set </span>
          {'"'}
          <span className={classes.bold}>{resultName}</span>
          {'" as result on Result Setting Round'}
        </Fragment>
      );
    }
    return (
      <Fragment>
        {'"'}
        <span className={classes.bold}>{resultName}</span>
        {'" was '}
        <span className={classes.bold}>Voted</span>
        {` as result on Arbitration Round # ${eventRound}`}
      </Fragment>
    );
  }

  render() {
    const { resultSetsHistory, intl, classes } = this.props;
    const cards = resultSetsHistory.map((resultSet, index) => {
      const { amount, block, txStatus } = resultSet;
      const blockTime = block ? getTimeString(block.blockTime) : intl.formatMessage(messages.strPendingMsg);
      return (
        <Grid container className={classes.grid} justify="center" key={`result-${index}`}>
          <Grid item xs={10} sm={10}>
            <Card
              className={classes.card}
            >
              <CardContent>
                <Typography color='textPrimary'>
                  {this.renderCardString(resultSet, intl, classes, index)}
                </Typography>
              </CardContent>
            </Card>
            <div className={classes.note}>
              <Typography color='textPrimary'>
                {`${amount} ${Token.NBOT} · ${txStatus} · ${blockTime} · `}
                <a href={`${EXPLORER.TX}/${resultSet.txid}`} target="_blank" className={classes.link}>
                  {'Detail'}
                </a>
              </Typography>
            </div>
          </Grid>
        </Grid>
      );
    });

    return (
      <div>
        {resultSetsHistory.length ? (
          <InfiniteScroll
            spacing={0}
            data={cards}
            loadMore={() => { console.log('hello'); }}
            loadingMore={false}
          />
        ) : (
          <CenteredDiv>
            <Typography variant="body2">
              <FormattedMessage id="str.emptyResultSetHistory" defaultMessage="There are no previous results for now." />
            </Typography>
          </CenteredDiv>
        )}
      </div>
    );
  }
}
