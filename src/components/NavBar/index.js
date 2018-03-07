import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Badge from 'material-ui/Badge';
import Button from 'material-ui/Button';
import AccountBalanceWalletIcon from 'material-ui-icons/AccountBalanceWallet';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { withStyles } from 'material-ui/styles';

import NavEventsButtons from './components/NavEventsButtons/index';
import styles from './styles';

class NavBar extends React.PureComponent {
  constructor(props) {
    super(props);

    this.renderActivitiesButtonWithBadge = this.renderActivitiesButtonWithBadge.bind(this);
    this.getTotalQTUM = this.getTotalQTUM.bind(this);
    this.getTotalBOT = this.getTotalBOT.bind(this);
  }

  render() {
    const {
      classes,
      walletAddrs,
      actionableItemCount,
    } = this.props;

    return (
      <AppBar position="fixed">
        <Toolbar className={classes.navBarWrapper}>
          <Link to="/">
            <img
              src="http://res.cloudinary.com/dd1ixvdxn/image/upload/c_scale,h_38/v1514426750/logo_en_oa4ewt.svg"
              alt="bodhi-logo"
              className={classes.navBarLogo}
            />
          </Link>
          <NavEventsButtons
            buttons={[{
              text: 'Bet',
            }, {
              text: 'Set',
            }, {
              text: 'Vote',
            }, {
              text: 'Finalize',
            }, {
              text: 'Withdraw',
            }]}
          />
          <div className={classes.navBarRightWrapper}>
            <Link to="/my-wallet">
              <Button className={classes.navBarWalletButton}>
                <AccountBalanceWalletIcon fontSize className={classes.navBarWalletIcon} />
                {`${this.getTotalQTUM()} QTUM / ${this.getTotalBOT()} BOT`}
              </Button>
            </Link>
            <Link to="/activities">
              <Button onClick={this.props.langHandler} className={classes.navBarRightButton}>
                <FormattedMessage id="language.select" />
              </Button>
            </Link>
            {this.renderActivitiesButtonWithBadge()}
          </div>
        </Toolbar>
      </AppBar>
    );
  }

  renderActivitiesButtonWithBadge() {
    const {
      classes,
      actionableItemCount,
    } = this.props;

    if (actionableItemCount) {
      return (
        <Badge badgeContent={actionableItemCount} color="secondary">
          <Button className={classes.navBarRightButton}>
            <FormattedMessage id="navBar.activities" defaultMessage="My Activities" />
          </Button>
        </Badge>
      );
    }

    return (
      <Button className={classes.navBarRightButton}>
        <FormattedMessage id="navBar.activities" defaultMessage="My Activities" />
      </Button>
    );
  }

  getTotalQTUM() {
    const {
      walletAddrs,
    } = this.props;

    let total = 0;
    if (walletAddrs && walletAddrs.length) {
      total = _.sumBy(this.props.walletAddrs, (wallet) => wallet.qtum ? wallet.qtum : 0);
    }

    return total.toFixed(2);
  }

  getTotalBOT() {
    const {
      walletAddrs,
    } = this.props;

    let total = 0;
    if (walletAddrs && walletAddrs.length) {
      total = _.sumBy(this.props.walletAddrs, (wallet) => wallet.bot ? wallet.bot : 0);
    }

    return total.toFixed(2);
  }
}

NavBar.propTypes = {
  classes: PropTypes.object.isRequired,
  walletAddrs: PropTypes.array,
  actionableItemCount: PropTypes.number,
  langHandler: PropTypes.func,
};

NavBar.defaultProps = {
  walletAddrs: [],
  actionableItemCount: undefined,
  langHandler: undefined,
};

const mapStateToProps = (state) => ({
  ...state.App.toJS(),
  actionableItemCount: state.Dashboard.get('actionableItemCount'),
});

const mapDispatchToProps = (dispatch) => ({});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(NavBar)));
