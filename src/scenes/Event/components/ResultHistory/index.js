import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { orderBy, cloneDeep, filter, map, sum } from 'lodash';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { TableBody, TableCell, TableHead, TableRow, withStyles } from '@material-ui/core';
import { ResponsiveTable } from 'components';
import { Token, Phases } from 'constants';
import styles from './styles';


@injectIntl
@withStyles(styles, { withTheme: true })
export default class EventResultHistory extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    oracles: PropTypes.array.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  };

  getTypeText(oracle, index) {
    if (oracle.token === Token.QTUM) {
      return <FormattedMessage id="str.bettingRound" defaultMessage="Betting Round" />;
    } else if (index === 1) {
      return <FormattedMessage id="str.resultSettingRound" defaultMessage="Result Setting Round" />;
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
    const { oracles } = this.props;
    let sortedOracles = orderBy(oracles, ['endTime']);

    // Add Result Setting round
    if (sortedOracles.length >= 2) {
      const resultSettingRound = cloneDeep(sortedOracles[0]);

      // Set the amount to display the consensus threshold
      resultSettingRound.amounts.fill(0);
      resultSettingRound.amounts[resultSettingRound.resultIdx] = resultSettingRound.consensusThreshold;

      // Set the endTime and token
      resultSettingRound.endTime = sortedOracles[1].endTime;
      resultSettingRound.token = sortedOracles[1].token;

      // Insert row after Betting round
      sortedOracles.splice(1, 0, resultSettingRound);
    }

    // Remove Oracles in Voting phase since that would be the current detail page.
    // Should only show the history of previously finished Oracles, not current one.
    sortedOracles = filter(sortedOracles, (oracle) => oracle.status !== Phases.VOTING);

    return (
      <div>
        {sortedOracles.length && (
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
              <ResultRows sortedOracles={sortedOracles} getTypeText={this.getTypeText} {...this.props} />
            </TableBody>
          </ResponsiveTable>
        )}
      </div>
    );
  }
}

const ResultRows = ({ sortedOracles, intl, getTypeText }) => map(sortedOracles, (oracle, index) => {
  const { resultIdx, options } = oracle;

  // Show winning outcomes on specific rows
  let winningOutcome;
  if (resultIdx != null && oracle.phase !== Phases.BETTING) {
    winningOutcome = options[resultIdx].name;

    // Localize Invalid name
    if (winningOutcome === 'Invalid') {
      winningOutcome = oracle.localizedInvalid.parse(intl.locale);
    }

    // Append outcome number
    winningOutcome = `#${resultIdx + 1} ${winningOutcome}`;
  }

  return (
    <TableRow key={`result-${index}`}>
      <TableCell padding="dense">{moment.unix(oracle.endTime).format('LLL')}</TableCell>
      <TableCell padding="dense">{getTypeText(oracle, index)}</TableCell>
      <TableCell padding="dense">{winningOutcome}</TableCell>
      <TableCell padding="dense">{`${sum(oracle.amounts)} ${oracle.token}`}</TableCell>
    </TableRow>
  );
});
