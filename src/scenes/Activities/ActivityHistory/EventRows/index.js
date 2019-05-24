import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import moment from 'moment';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import { TableBody, TableCell, TableRow, withStyles } from '@material-ui/core';
import { TransactionHistoryID, TransactionHistoryAddress } from 'components';
import { Token } from 'constants';
import styles from './styles';
import { i18nToUpperCase } from '../../../../helpers/i18nUtil';
import { getTxTypeString } from '../../../../helpers/stringUtil';
import { satoshiToDecimal, weiToDecimal } from '../../../../helpers/utility';

const messages = defineMessages({
  strPendingMsg: {
    id: 'str.pending',
    defaultMessage: 'Pending',
  },
  strSuccessMsg: {
    id: 'str.success',
    defaultMessage: 'Success',
  },
  strFailMsg: {
    id: 'str.fail',
    defaultMessage: 'Fail',
  },
});
@injectIntl
@withStyles(styles, { withTheme: true })
@withRouter
@inject('store')
@observer
class EventRow extends Component {
    static propTypes = {
      intl: intlShape.isRequired, // eslint-disable-line react/no-typos
      classes: PropTypes.object.isRequired,
      transaction: PropTypes.object.isRequired,
      history: PropTypes.object.isRequired,
    };

    state = {
      expanded: false,
    }

    onArrowIconClick = () => {
      this.setState({ expanded: !this.state.expanded });
    }

    onEventNameClick = (eventAddress) => async (event) => {
      event.stopPropagation();
      if (eventAddress) {
        const { history } = this.props;
        const nextLocation = `/event/${eventAddress}`;
        if (nextLocation) history.push(nextLocation);
      }
    }

    render() {
      const { transaction, intl, classes, store: { wallet: { exchangeRate } } } = this.props;
      const { txType, txid, txReceipt: { cumulativeGasUsed, gasPrice }, txStatus, block, name, address, amount } = transaction;
      const blockTime = block ? block.blockTime : messages.strPendingMsg;
      const { expanded } = this.state;
      const gasFee = (satoshiToDecimal(gasPrice) / weiToDecimal(exchangeRate)) * satoshiToDecimal(cumulativeGasUsed);

      return (
        <Fragment>
          <TableRow selected={expanded}>
            <TableCell>{block ? moment.unix(blockTime).format('LLL') : intl.formatMessage(blockTime)}</TableCell>
            <TableCell>{getTxTypeString(txType, intl)}</TableCell>
            <NameLinkCell clickable onClick={this.onEventNameClick(address)}>
              {name || ''}
            </NameLinkCell>
            <TableCell numeric>{amount ? `${satoshiToDecimal(amount)} ${Token.NBOT}` : ''}</TableCell>
            <TableCell numeric>{satoshiToDecimal(gasFee)}</TableCell>
            <TableCell>
              <FormattedMessage id={`str.${txStatus}`.toLowerCase()}>
                {(txt) => i18nToUpperCase(txt)}
              </FormattedMessage>
            </TableCell>
            <TableCell>
              <i
                className={cx(expanded ? 'icon-ic_down' : 'icon-ic_up', 'icon iconfont', classes.arrowIcon)}
                onClick={this.onArrowIconClick}
              />
            </TableCell>
          </TableRow>
          <CollapsableItem expanded={expanded}>
            <TableRow key={`txaddr-${txid}`} selected className={expanded ? classes.show : classes.hide}>
              <TransactionHistoryAddress colSpan={3} transaction={transaction} />
              <TransactionHistoryID colSpan={4} transaction={transaction} />
            </TableRow>
          </CollapsableItem>
        </Fragment>
      );
    }
}

const EventRows = ({ store: { activities: { history: { displayedTxs } } } }) => (
  <TableBody>
    {displayedTxs.map((transaction) => (<EventRow key={transaction.txid} transaction={transaction} />))}
  </TableBody>
);

const NameLinkCell = withStyles(styles)(({ classes, clickable, topic, ...props }) => (
  <TableCell>
    <span className={clickable && classes.eventNameText} {...props} />
  </TableCell>
));

const CollapsableItem = withStyles(styles)(({ expanded, children }) => (
  <Fragment>
    { expanded && children }
  </Fragment>
));

export default inject('store')(observer(EventRows));
