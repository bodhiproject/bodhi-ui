import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape, defineMessages, FormattedHTMLMessage } from 'react-intl';
import { Grid, Card, CardContent, withStyles, Typography } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import { Token } from 'constants';
import styles from './styles';
import { CenteredDiv } from '../TransactionHistory';
import { getTimeString, toFixed } from '../../../../helpers';
import { EXPLORER } from '../../../../network/routes';
import InfiniteScroll from '../../../../components/InfiniteScroll';
import { getStatusString } from '../../../../helpers/stringUtil';

const messages = defineMessages({
  strDetailMsg: {
    id: 'str.detail',
    defaultMessage: 'Detail',
  },
  emptyTxHistoryMsg: {
    id: 'str.emptyResultSetHistory',
    defaultMessage: 'There are no previous results for now.',
  },
  strPendingMsg: {
    id: 'str.pending',
    defaultMessage: 'Pending',
  },
  strRound0: {
    id: 'resultHistoryEntry.round0',
    defaultMessage: '{who} set "<b>{resultName}</b>" as result on "<b>Result Setting Round</b>"',
  },
  strRoundMore: {
    id: 'resultHistoryEntry.roundMore',
    defaultMessage: '"<b>{resultName}</b>" was voted as result on "<b>Arbitration Round #{eventRound}</b>"',
  },
  strYou: {
    id: 'str.you',
    defaultMessage: 'You',
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

  renderCardString = (resultSet, intl) => {
    const { store: { naka: { account } } } = this.props;
    const { eventRound, txSender } = resultSet;
    let { resultName } = resultSet;
    if (resultName.length > 20) resultName = `${resultName.slice(0, 6)}...${resultName.slice(-6)}`;

    if (eventRound === 0) {
      const who = (account && account.toLowerCase() === txSender && intl.formatMessage(messages.strYou)) || `${txSender.slice(0, 6)}...${txSender.slice(-6)}`;
      return (
        <Fragment>
          <FormattedHTMLMessage
            id="resultHistoryEntry.round0"
            defaultMessage={'{who} set "<b>{resultName}</b>" as result on "<b>Result Setting Round</b>"'}
            values={{ who, resultName }}
          />
        </Fragment>
      );
    }
    return (
      <Fragment>
        <FormattedHTMLMessage
          id="resultHistoryEntry.roundMore"
          defaultMessage={'"<b>{resultName}</b>" was voted as result on "<b>Arbitration Round #{eventRound}</b>"'}
          values={{ resultName, eventRound }}
        />
      </Fragment>
    );
  }

  render() {
    const { intl, classes, store: { history: { loadingMore } } } = this.props;
    let { resultSetsHistory } = this.props;
    resultSetsHistory = resultSetsHistory.slice(0, 5);
    const cards = resultSetsHistory.map((resultSet, index) => {
      const { amount, block, txStatus } = resultSet;
      const blockTime = block ? getTimeString(block.blockTime) : intl.formatMessage(messages.strPendingMsg);
      const status = getStatusString(txStatus, intl);

      return (
        <Grid container className={classes.grid} justify="center" key={`result-${index}`}>
          <Grid item xs={10} sm={10}>
            <Card
              className={classes.card}
            >
              <CardContent>
                <Typography color='textPrimary'>
                  {this.renderCardString(resultSet, intl)}
                </Typography>
              </CardContent>
            </Card>
            <div className={classes.note}>
              <Typography color='textPrimary'>
                {`${toFixed(amount, true)} ${Token.NBOT} · ${status} · ${blockTime} · `}
                <a href={`${EXPLORER.TX}/${resultSet.txid}`} target="_blank" className={classes.link}>
                  {intl.formatMessage(messages.strDetailMsg)}
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
            loadMore={() => {}}
            loadingMore={loadingMore}
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
