import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { TableBody, TableCell, TableRow, withStyles } from '@material-ui/core';
import { TransactionHistoryID, TransactionHistoryAddress } from 'components';

import styles from './styles';
import { getShortLocalDateTimeString } from '../../../../helpers/utility';
import { i18nToUpperCase } from '../../../../helpers/i18nUtil';
import { getTxTypeString } from '../../../../helpers/stringUtil';

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

    onEventNameClick = (topicAddress) => async (event) => {
      event.stopPropagation();
      if (topicAddress) {
        const { activities: { history: { getOracleAddress } } } = this.props.store;
        const { history } = this.props;
        const nextLocation = await getOracleAddress(topicAddress);
        if (nextLocation) history.push(nextLocation);
      }
    }

    render() {
      const { transaction, intl, classes } = this.props;
      const { name, topic, type, txid, amount, token, fee, status, createdTime } = transaction;
      const { locale, messages: localeMessages } = intl;
      const { expanded } = this.state;

      return (
        <Fragment>
          <TableRow selected={expanded}>
            <TableCell className={classes.summaryRowCell}>{getShortLocalDateTimeString(createdTime)}</TableCell>
            <TableCell>{getTxTypeString(type, locale, localeMessages)}</TableCell>
            <NameLinkCell clickable={topic && topic.address} onClick={this.onEventNameClick(topic && topic.address)}>
              {(topic && topic.name) || name}
            </NameLinkCell>
            <TableCell numeric>{`${amount || ''}  ${amount ? token : ''}`}</TableCell>
            <TableCell numeric>{fee}</TableCell>
            <TableCell>
              <FormattedMessage id={`str.${status}`.toLowerCase()}>
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

const EventRows = observer(({ displayedTxs }) => (
  <TableBody>
    {displayedTxs.map((transaction) => (<EventRow key={transaction.txid} transaction={transaction} />))}
  </TableBody>
));

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

export default EventRows;
