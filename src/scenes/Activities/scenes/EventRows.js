import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';
import {
  TableBody,
  TableCell,
  TableRow,
  withStyles,
} from '@material-ui/core';
import cx from 'classnames';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import styles from './styles';
import TransactionHistoryID from '../../../components/TransactionHistoryAddressAndID/id';
import TransactionHistoryAddress from '../../../components/TransactionHistoryAddressAndID/address';
import { getShortLocalDateTimeString } from '../../../helpers/utility';
import { i18nToUpperCase } from '../../../helpers/i18nUtil';
import { getTxTypeString } from '../../../helpers/stringUtil';

@injectIntl
@withStyles(styles, { withTheme: true })
export default class EventRows extends Component {
  static propTypes = {
    txs: PropTypes.array,
    history: PropTypes.object.isRequired,
  };

  static defaultProps = {
    txs: undefined,
  };

  render() {
    const { txs, history } = this.props;

    return (
      <TableBody>
        {txs.map((transaction) => (<EventRow key={transaction.txid} transaction={transaction} history={history} />))}
      </TableBody>
    );
  }
}

@injectIntl
@withStyles(styles, { withTheme: true })
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

    handleClick = (txid, topicAddress) => (event) => { // eslint-disable-line
      if (topicAddress) {
        const { activities: { activityHistory: { oracleJump } } } = this.props.store;
        const { history } = this.props;
        oracleJump(topicAddress, history);
      }
    }

    render() {
      const { transaction, intl, classes } = this.props;
      const { name, topic, type, txid, amount, token, fee, status, createdTime } = transaction;
      const { locale, messages: localeMessages } = intl;
      const { expanded } = this.state;

      return (
        <Fragment>
          <TableRow selected={expanded} onClick={() => this.setState({ expanded: !this.state.expanded })} className={classes.clickToExpandRow}>
            <TableCell className={classes.summaryRowCell}>{getShortLocalDateTimeString(createdTime)}</TableCell>
            <TableCell>{getTxTypeString(type, locale, localeMessages)}</TableCell>
            <NameLinkCell className={classes.viewEventLink} clickable={topic && topic.address} onClick={this.handleClick(txid, topic && topic.address)}>
              {name || (topic && topic.name)}
            </NameLinkCell>
            <TableCell numeric>{`${amount || ''}  ${amount ? token : ''}`}</TableCell>
            <TableCell numeric>{fee}</TableCell>
            <TableCell>
              <FormattedMessage id={`str.${status}`.toLowerCase()}>
                {(txt) => i18nToUpperCase(txt)}
              </FormattedMessage>
            </TableCell>
            <TableCell>
              <i className={cx(expanded ? 'icon-ic_down' : 'icon-ic_up', 'icon iconfont', classes.arrowSize)} />
            </TableCell>
          </TableRow>
          <CollapsableItem expanded={expanded}>
            <TableRow key={`txaddr-${txid}`} selected onClick={() => this.setState({ expanded: !this.state.expanded })} className={expanded ? classes.show : classes.hide}>
              <TransactionHistoryAddress transaction={transaction} className={classes.detailRow} />
              <TableCell /><TransactionHistoryID transaction={transaction} />
              <TableCell />
              <TableCell /><TableCell /><TableCell />
            </TableRow>
          </CollapsableItem>
        </Fragment>
      );
    }
}

const NameLinkCell = withStyles(styles)(({ className, clickable, topic, ...props }) => (
  <TableCell>
    <span className={clickable && className.viewEventLink} {...props} />
  </TableCell>
));

const CollapsableItem = withStyles(styles)(({ expanded, children }) => (
  <Fragment>
    { expanded && children }
  </Fragment>
));
