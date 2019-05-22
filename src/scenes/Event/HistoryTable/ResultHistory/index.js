import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { orderBy, cloneDeep, filter, map, sum } from 'lodash';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import { TableBody, TableCell, TableHead, TableRow, withStyles, Typography } from '@material-ui/core';
import { ResponsiveTable } from 'components';
import { Token, Phases } from 'constants';
import styles from './styles';
import { CenteredDiv } from '../TransactionHistory';

const messages = defineMessages({
  emptyTxHistoryMsg: {
    id: 'str.emptyResultSetHistory',
    defaultMessage: 'There are no previous results for now.',
  },
});

@injectIntl
@withStyles(styles, { withTheme: true })
export default class EventResultHistory extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    resultSetsHistory: PropTypes.array.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  };

  getTypeText(resultSet, index) {
    if (resultSet.eventRound === 0) {
      return <FormattedMessage id="str.bettingRound" defaultMessage="Betting Round" />;
    }
    return (
      <FormattedMessage
        id="str.arbitrationRoundX"
        defaultMessage="Arbitration Round {idx}"
        values={{ idx: index - 1 }}
      />
    );
  }

  render() {
    const { resultSetsHistory } = this.props;
    return (
      <div>
        {resultSetsHistory.length ? (
          <ResponsiveTable>
            <TableHead>
              <TableRow>
                <TableCell padding="dense">
                  <FormattedMessage id="str.date" defaultMessage="Date" />
                </TableCell>
                <TableCell padding="dense">
                  <FormattedMessage id="str.resultType" defaultMessage="Result Type" />
                </TableCell>
                <TableCell padding="dense">
                  <FormattedMessage id="str.winningOutcome" defaultMessage="Winning Outcome" />
                </TableCell>
                <TableCell padding="dense">
                  <FormattedMessage id="str.amount" defaultMessage="Amount" />
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <ResultRows resultSetsHistory={resultSetsHistory} getTypeText={this.getTypeText} {...this.props} />
            </TableBody>
          </ResponsiveTable>
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

const ResultRows = ({ resultSetsHistory, intl, getTypeText }) => map(resultSetsHistory, (resultSet, index) => {
  const { resultIdx, amount, block: { blockTime } } = resultSet;

  return (
    <TableRow key={`result-${index}`}>
      <TableCell padding="dense">{moment.unix(blockTime).format('LLL')}</TableCell>
      <TableCell padding="dense">{getTypeText(resultSet, index)}</TableCell>
      <TableCell padding="dense">{resultIdx}</TableCell>
      <TableCell padding="dense">{`${amount} NBOT`}</TableCell>
    </TableRow>
  );
});
