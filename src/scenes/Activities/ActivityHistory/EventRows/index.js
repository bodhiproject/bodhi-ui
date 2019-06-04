import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';
import { Grid, Card, CardContent, Typography, withStyles, TableBody, TableCell } from '@material-ui/core';
import { TransactionHistoryID, TransactionHistoryAddress } from 'components';
import { Token, TransactionType } from 'constants';
import styles from './styles';
import { i18nToUpperCase } from '../../../../helpers/i18nUtil';
import { getTxTypeString } from '../../../../helpers/stringUtil';
import { satoshiToDecimal, weiToDecimal, getTimeString } from '../../../../helpers/utility';

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
  createEvent: {
    id: 'action.createEvent',
    defaultMessage: 'Create',
  },
  bet: {
    id: 'action.bet',
    defaultMessage: 'Bet',
  },
  setResult: {
    id: 'action.setResult',
    defaultMessage: 'Set',
  },
  vote: {
    id: 'action.vote',
    defaultMessage: 'Vote',
  },
  withdraw: {
    id: 'action.withdraw',
    defaultMessage: 'Withdraw',
  },
  strYou: {
    id: 'str.you',
    defaultMessage: 'You',
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

    getActionString = (transaction, intl) => {
      const { txType } = transaction;
      switch (txType) {
        case TransactionType.CREATE_EVENT: {
          return intl.formatMessage(messages.createEvent);
        }
        case TransactionType.BET: {
          return intl.formatMessage(messages.bet);
        }
        case TransactionType.RESULT_SET: {
          return intl.formatMessage(messages.setResult);
        }
        case TransactionType.VOTE: {
          return intl.formatMessage(messages.vote);
        }
        case TransactionType.WITHDRAW: {
          return intl.formatMessage(messages.withdraw);
        }
        default: {
          console.error(`Invalid txType: ${txType}`); // eslint-disable-line
          return '';
        }
      }
    }

    renderCardString = (transaction, intl, classes) => {
      const you = intl.formatMessage(messages.strYou);
      const action = this.getActionString(transaction, intl);
      const { txType, name, amount } = transaction;
      switch (txType) {
        case TransactionType.CREATE_EVENT: {
          return (
            <Typography>
              {you}
              <span className={classes.bold}>{` ${action} `}</span>
              {' "'}
              <span className={classes.bold}>{name}</span>
              {'" Event'}
            </Typography>
          );
        }
        case TransactionType.BET: {
          return (
            <Typography>
              {you}
              <span className={classes.bold}>{` ${action} `}</span>
              {' on "'}
              <span className={classes.bold}>{name}</span>
              {'" in "'}
              <span className={classes.bold}>{name}</span>
              {'" Event'}
            </Typography>
          );
        }
        case TransactionType.RESULT_SET: {
          return (
            <Typography>
              {you}
              <span className={classes.bold}>{` ${action} `}</span>
              {' "'}
              <span className={classes.bold}>{name}</span>
              {'" as result in "'}
              <span className={classes.bold}>{name}</span>
              {'" Event'}
            </Typography>
          );
        }
        case TransactionType.VOTE: {
          return (
            <Typography>
              {you}
              <span className={classes.bold}>{` ${action} `}</span>
              {' on "'}
              <span className={classes.bold}>{name}</span>
              {'" in "'}
              <span className={classes.bold}>{name}</span>
              {'" Event'}
            </Typography>
          );
        }
        case TransactionType.WITHDRAW: {
          return (
            <Typography>
              {you}
              <span className={classes.bold}>{` ${action} `}</span>
              {`${amount} ${Token.NBOT} from "`}
              <span className={classes.bold}>{name}</span>
              {'" Event'}
            </Typography>
          );
        }
        default: {
          console.error(`Invalid txType: ${txType}`); // eslint-disable-line
          return (
            <Typography>
              {`Invalid txType: ${txType}`}
            </Typography>
          );
        }
      }
    }

    render() {
      const { transaction, intl, classes, store: { wallet: { exchangeRate } } } = this.props;
      const { txid, txStatus, block, address, amount } = transaction;
      const blockTime = block ? getTimeString(block.blockTime) : intl.formatMessage(messages.strPendingMsg);

      return (
        <Fragment>
          <Grid item xs={12} sm={12} className={classes.border}>
            <Card
              className={classes.card}
              // onClick={() => this.props.store.createEvent.setArbOptionSelected(Number(idx))}
            >
              <CardContent>
                {this.renderCardString(transaction, intl, classes)}
              </CardContent>
            </Card>
            <div className={classes.note}>
              <Typography>
                {`${satoshiToDecimal(amount)} ${Token.NBOT} . ${txStatus} . ${blockTime} . Detail`}
              </Typography>
            </div>
          </Grid>
        </Fragment>
      );
      // return (
      //   <Fragment>
      //     <TableRow selected={expanded}>
      //       <TableCell>{block ? getTimeString(blockTime) : intl.formatMessage(blockTime)}</TableCell>
      //       <TableCell>{getTxTypeString(txType, intl)}</TableCell>
      //       <NameLinkCell clickable onClick={this.onEventNameClick(address)}>
      //         {name || ''}
      //       </NameLinkCell>
      //       <TableCell numeric>{amount ? `${satoshiToDecimal(amount)} ${Token.NBOT}` : ''}</TableCell>
      //       <TableCell>
      //         <FormattedMessage id={`str.${txStatus}`.toLowerCase()}>
      //           {(txt) => i18nToUpperCase(txt)}
      //         </FormattedMessage>
      //       </TableCell>
      //       <TableCell>
      //         <i
      //           className={cx(expanded ? 'icon-ic_down' : 'icon-ic_up', 'icon iconfont', classes.arrowIcon)}
      //           onClick={this.onArrowIconClick}
      //         />
      //       </TableCell>
      //     </TableRow>
      //     <CollapsableItem expanded={expanded}>
      //       <TableRow key={`txaddr-${txid}`} selected className={expanded ? classes.show : classes.hide}>
      //         <TransactionHistoryAddress colSpan={3} transaction={transaction} />
      //         <TransactionHistoryID colSpan={4} transaction={transaction} />
      //       </TableRow>
      //     </CollapsableItem>
      //   </Fragment>
      // );
    }
}

const EventRows = ({ store: { activities: { history: { displayedTxs } } } }) => (
  displayedTxs.map((transaction) => (<EventRow key={transaction.txid} transaction={transaction} />))
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
