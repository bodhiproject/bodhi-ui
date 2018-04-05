import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import { Token } from '../../../../constants';
import { getLocalDateTimeString } from '../../../../helpers/utility';
import { i18nToUpperCase } from '../../../../helpers/i18nUtil';
import styles from './styles';

class EventResultHistory extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    oracles: PropTypes.array.isRequired,
  };

  render() {
    const { classes, oracles } = this.props;

    const sortedOracles = _.orderBy(oracles, ['endTime']);

    return (
      <div className={classes.detailTxWrapper}>
        <Typography variant="headline" className={classes.detailTxTitle}>
          <FormattedMessage id="str.resultHistory" defaultMessage="Result History">
            {(txt) => i18nToUpperCase(txt)}
          </FormattedMessage>
        </Typography> {
          sortedOracles.length ?
            (<Table>
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
                    <TableCell padding="dense">{oracle.token === Token.Qtum ? 'Betting Round' : `Voting Round ${index}`}</TableCell>
                    <TableCell padding="dense">
                      {index !== sortedOracles.length - 1
                        ? `#${oracle.resultIdx + 1} ${oracle.options[oracle.resultIdx]}`
                        : ''
                      }
                    </TableCell>
                    <TableCell padding="dense">{`${_.sum(oracle.amounts)} ${oracle.token}`}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>) :
            <Typography variant="body1">
              <FormattedMessage id="str.emptyTxHistory" defaultMessage="You do not have any transactions right now." />
            </Typography>
        }
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(injectIntl(EventResultHistory));
