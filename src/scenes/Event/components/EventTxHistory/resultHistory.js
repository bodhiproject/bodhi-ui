import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import { withStyles, Typography } from 'material-ui';

import { Token } from '../../../../constants';
import { getLocalDateTimeString } from '../../../../helpers/utility';
import { i18nToUpperCase } from '../../../../helpers/i18nUtil';
import styles from './styles';


@injectIntl
@withStyles(styles, { withTheme: true })
export default class EventResultHistory extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    oracles: PropTypes.array.isRequired,
  };

  checktype(oracle, index) {
    if (oracle.token === Token.Qtum) {
      return <FormattedMessage id="str.betRound" defaultMessage="Betting Round" />;
    } else if (index === 1) {
      return <FormattedMessage id="str.resultSetRound" defaultMessage="Result Setting Round" />;
    }
    return <FormattedMessage id="str.voteRound" defaultMessage="Voting Round {idx}" values={{ idx: index - 1 }} />;
  }

  render() {
    const { classes, oracles } = this.props;
    let sortedOracles = _.orderBy(oracles, ['endTime']);
    if (sortedOracles.length) {
      const row1 = sortedOracles.splice(0, 1)[0];
      const rowLeft = sortedOracles;
      const resultSettingOracle = {};
      resultSettingOracle.endTime = rowLeft[0].endTime;
      resultSettingOracle.token = rowLeft[0].token;
      resultSettingOracle.resultIdx = row1.resultIdx;
      resultSettingOracle.options = row1.options;
      resultSettingOracle.amounts = row1.amounts;
      resultSettingOracle.amounts.fill(0);
      resultSettingOracle.amounts[resultSettingOracle.resultIdx] = 100;
      sortedOracles = [row1, resultSettingOracle, ...rowLeft];
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
              {_.map(sortedOracles, (oracle, index) => (
                <TableRow key={`result-${index}`} selected={index % 2 === 1}>
                  <TableCell padding="dense">{getLocalDateTimeString(oracle.endTime)}</TableCell>
                  <TableCell padding="dense">{this.checktype(oracle, index)}</TableCell>
                  <TableCell padding="dense">
                    {index !== sortedOracles.length - 1 && index !== 0
                      ? `#${oracle.resultIdx + 1} ${oracle.options[oracle.resultIdx]}`
                      : ''
                    }
                  </TableCell>
                  <TableCell padding="dense">{`${_.sum(oracle.amounts)} ${oracle.token}`}</TableCell>
                </TableRow>
              ))}
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
