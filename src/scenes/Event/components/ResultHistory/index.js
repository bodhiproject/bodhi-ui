import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Table, TableBody, TableCell, TableHead, TableRow, withStyles, Typography } from '@material-ui/core';
import { Token, Phases, OracleStatus } from 'constants';
import { getShortLocalDateTimeString, i18nToUpperCase } from '../../../../helpers';
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
    const { classes, currentEvent, oracles, intl } = this.props;
    console.log('event', currentEvent);
    console.log('oracles', oracles);
    const sortedOracles = _.orderBy(oracles, ['endTime']);

    // Add Result Setting round
    if (sortedOracles.length >= 2) {
      const resultSettingRound = _.clone(sortedOracles[0]);

      // Set the amount to display the consensus threshold
      resultSettingRound.amounts.fill(0);
      resultSettingRound.amounts[resultSettingRound.resultIdx] = resultSettingRound.consensusThreshold;

      // Set the endTime and token
      resultSettingRound.endTime = sortedOracles[1].endTime;
      resultSettingRound.token = sortedOracles[1].token;

      // Insert row after Betting round
      sortedOracles.splice(1, 0, resultSettingRound);
    }

    console.log('sorted', sortedOracles);
    const filteredOracles = _.filter(sortedOracles, (oracle) => oracle.status !== OracleStatus.VOTING);
    console.log('filtered', filteredOracles);

    return (
      <div className={classes.detailTxWrapper}>
        <Typography variant="headline" className={classes.detailTxTitle}>
          <FormattedMessage id="str.resultHistory" defaultMessage="Result History">
            {(txt) => i18nToUpperCase(txt)}
          </FormattedMessage>
        </Typography>
        {filteredOracles.length ? (
          <Table>
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
              {_.map(sortedOracles, (oracle, index) => {
                const { resultIdx, options } = oracle;

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
                  <TableRow key={`result-${index}`} selected={index % 2 === 1}>
                    <TableCell padding="dense">{getShortLocalDateTimeString(oracle.endTime)}</TableCell>
                    <TableCell padding="dense">{this.getTypeText(oracle, index)}</TableCell>
                    <TableCell padding="dense">{winningOutcome}</TableCell>
                    <TableCell padding="dense">{`${_.sum(oracle.amounts)} ${oracle.token}`}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <Typography variant="body1">
            <FormattedMessage id="str.emptyTxHistory" defaultMessage="You do not have any transactions right now." />
          </Typography>
        )}
      </div>
    );
  }
}
