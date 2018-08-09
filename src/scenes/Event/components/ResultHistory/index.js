import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  withStyles,
  Typography,
} from '@material-ui/core';
import { Token } from 'constants';

import { getShortLocalDateTimeString, i18nToUpperCase, localizeInvalidOption } from '../../../../helpers';
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
    return <FormattedMessage id="str.arbitrationRoundX" defaultMessage="Arbitration Round {idx}" values={{ idx: index - 1 }} />;
  }

  render() {
    const { classes, oracles, intl } = this.props;
    const sortedOracles = _.orderBy(oracles, ['endTime']);
    if (sortedOracles.length) {
      const { resultIdx, options, amounts, consensusThreshold } = sortedOracles[0];
      const { endTime, token } = sortedOracles[1];
      const resultSettingRound = { endTime, token, resultIdx, options };
      resultSettingRound.amounts = _.clone(amounts);
      resultSettingRound.amounts.fill(0);
      resultSettingRound.amounts[resultSettingRound.resultIdx] = consensusThreshold;
      sortedOracles.splice(1, 0, resultSettingRound);
    }

    return (
      <div className={classes.detailTxWrapper}>
        <Typography variant="headline" className={classes.detailTxTitle}>
          <FormattedMessage id="str.resultHistory" defaultMessage="Result History">
            {(txt) => i18nToUpperCase(txt)}
          </FormattedMessage>
        </Typography>
        {sortedOracles.length ? (
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
                const invalidOption = localizeInvalidOption(oracle.options[oracle.resultIdx], intl);
                return (
                  <TableRow key={`result-${index}`} selected={index % 2 === 1}>
                    <TableCell padding="dense">{getShortLocalDateTimeString(oracle.endTime)}</TableCell>
                    <TableCell padding="dense">{this.getTypeText(oracle, index)}</TableCell>
                    <TableCell padding="dense">
                      {index !== sortedOracles.length - 1 && index !== 0
                        ? `#${oracle.resultIdx + 1} ${oracle.options[oracle.resultIdx] === 'Invalid' ? invalidOption : oracle.options[oracle.resultIdx].name}`
                        : ''
                      }
                    </TableCell>
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
