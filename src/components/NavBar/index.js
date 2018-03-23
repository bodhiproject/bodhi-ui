import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Badge from 'material-ui/Badge';
import Button from 'material-ui/Button';
import { FormattedMessage, injectIntl, intlShape, defaultMessage } from 'react-intl';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';

import { RouterPath, AppLocation, EventStatus } from '../../constants';
import styles from './styles';

class NavBar extends React.PureComponent {
  static propTypes = {
    match: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    walletAddresses: PropTypes.array.isRequired,
    actionableItemCount: PropTypes.object,
    langHandler: PropTypes.func,
    appLocation: PropTypes.string.isRequired,
  };

  static defaultProps = {
    actionableItemCount: undefined,
    langHandler: undefined,
  };

  constructor(props) {
    super(props);

    this.renderActivitiesButtonWithBadge = this.renderActivitiesButtonWithBadge.bind(this);
    this.getTotalQTUM = this.getTotalQTUM.bind(this);
    this.getTotalBOT = this.getTotalBOT.bind(this);
  }

  render() {
    const {
      classes,
      appLocation,
      walletAddresses,
      actionableItemCount,
      match,
    } = this.props;

    return (
      <AppBar position="fixed" className={classes.navBar}>
        <Toolbar className={classes.navBarWrapper}>
          <Link to={RouterPath.qtumPrediction}>
            <img
              src="http://res.cloudinary.com/dd1ixvdxn/image/upload/c_scale,h_38/v1514426750/logo_en_oa4ewt.svg"
              alt="bodhi-logo"
              className={classes.navBarLogo}
            />
          </Link>
          <Link to="/" className={classes.navBarLink}>
            <Button
              data-index={EventStatus.Bet}
              className={classNames(
                classes.navEventsButton,
                appLocation === AppLocation.qtumPrediction || appLocation === AppLocation.bet ? 'selected' : '',
              )}
            >
              <FormattedMessage id="navbar.qtumPrediction" defaultMessage="QTUM Prediction" />
            </Button>
            {
              appLocation === AppLocation.qtumPrediction || appLocation === AppLocation.bet
                ? this.renderCurrentTabArrow(RouterPath.qtumPrediction) : null
            }
          </Link>
          <Link to={RouterPath.botCourt} className={classes.navBarLink}>
            <Button
              data-index={EventStatus.Vote}
              className={classNames(
                classes.navEventsButton,
                appLocation === AppLocation.botCourt || appLocation === AppLocation.vote ? 'selected' : '',
              )}
            >
              <FormattedMessage id="navbar.botCourt" defaultMessage="BOT Court" />
            </Button>
            {
              appLocation === AppLocation.botCourt || appLocation === AppLocation.vote
                ? this.renderCurrentTabArrow(RouterPath.botCourt) : null
            }
          </Link>
          <div className={classes.navBarRightWrapper}>
            <Link to="/my-wallet" className={classes.navBarLink}>
              <Button className={classes.navBarWalletButton}>
                <i className={classNames('icon', 'iconfont', 'icon-ic_wallet', classes.navBarWalletIcon)}></i>
                {`${this.getTotalQTUM()} QTUM / ${this.getTotalBOT()} BOT`}
              </Button>
              { appLocation === AppLocation.wallet ? this.renderCurrentTabArrow(RouterPath.myWallet) : null }
            </Link>
            <Button onClick={this.props.langHandler} className={classes.navBarRightButton}>
              <FormattedMessage id="language.select" defaultMessage="中文" />
            </Button>
            {this.renderActivitiesButtonWithBadge()}
          </div>
        </Toolbar>
      </AppBar>
    );
  }

  renderCurrentTabArrow(currentPath) {
    const {
      classes,
      match,
    } = this.props;

    return (
      <img
        src="/images/nav-arrow.png"
        alt="nav-arrow"
        className={
          classNames(
            classes.navArrow,
            currentPath === RouterPath.myWallet || currentPath === RouterPath.set ? 'right' : ''
          )
        }
      />
    );
  }

  renderActivitiesButtonWithBadge() {
    const {
      classes,
      match,
      appLocation,
      actionableItemCount,
    } = this.props;

    if (actionableItemCount && actionableItemCount.totalCount) {
      return (
        <Link to={RouterPath.set} className={classes.navBarLink}>
          <Badge badgeContent={actionableItemCount.totalCount} color="secondary">
            <Button className={classes.navBarRightButton}>
              <FormattedMessage id="navBar.activities" defaultMessage="My Activities" />
            </Button>
          </Badge>
          {
            appLocation === AppLocation.myActivities
              || appLocation === AppLocation.resultSet
              || appLocation === AppLocation.finalize
              || appLocation === AppLocation.withdraw
              || appLocation === AppLocation.activityHistory
              ? this.renderCurrentTabArrow(RouterPath.set) : null
          }
        </Link>
      );
    }

    return (
      <Link to={RouterPath.set} className={classes.navBarLink}>
        <Button className={classes.navBarRightButton}>
          <FormattedMessage id="navBar.activities" defaultMessage="My Activities" />
        </Button>
        { this.renderCurrentTabArrow(RouterPath.set) }
      </Link>
    );
  }

  getTotalQTUM() {
    const {
      walletAddresses,
    } = this.props;

    let total = 0;
    if (walletAddresses && walletAddresses.length) {
      total = _.sumBy(walletAddresses, (wallet) => wallet.qtum ? wallet.qtum : 0);
    }

    return total.toFixed(2);
  }

  getTotalBOT() {
    const {
      walletAddresses,
    } = this.props;

    let total = 0;
    if (walletAddresses && walletAddresses.length) {
      total = _.sumBy(walletAddresses, (wallet) => wallet.bot ? wallet.bot : 0);
    }

    return total.toFixed(2);
  }
}

const mapStateToProps = (state) => ({
  ...state.App.toJS(),
  actionableItemCount: state.Graphql.get('actionableItemCount'),
});

const mapDispatchToProps = (dispatch) => ({});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(NavBar)));
