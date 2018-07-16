import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
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

const EventRows = observer(({ displayedTxs }) => (
  <TableBody>
    {displayedTxs.map((transaction) => (<EventRow key={transaction.txid} transaction={transaction} />))}
  </TableBody>
));

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

    handleClick = (txid, topicAddress) => async (event) => { // eslint-disable-line
      if (topicAddress) {
        const { activities: { history: { getOracleAddress } } } = this.props.store;
        const { history } = this.props;
        const nextAddress = await getOracleAddress(topicAddress);
        if (nextAddress) history.push(nextAddress);
      }
    }

    render() {
      const { transaction, intl, classes } = this.props;
      const { name, topic, type, txid, amount, token, fee, status, createdTime } = transaction;
      const { locale, messages: localeMessages } = intl;
      const { expanded } = this.state;

      return (
        <Fragment>
          <TableRow selected={expanded} onClick={() => this.setState({ expanded: !expanded })} className={classes.clickToExpandRow}>
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
            <TableRow key={`txaddr-${txid}`} selected onClick={() => this.setState({ expanded: !expanded })} className={expanded ? classes.show : classes.hide}>
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

export default EventRows;
