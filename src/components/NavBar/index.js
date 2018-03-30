import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route, Link as _Link } from 'react-router-dom';
import _ from 'lodash';
import { FormattedMessage, injectIntl } from 'react-intl';
import { AppBar, Toolbar, Badge, Button, withStyles } from 'material-ui';
import classNames from 'classnames';

import { RouterPath, AppLocation, EventStatus } from '../../constants';
import styles from './styles';

class NavBar extends Component {
  static propTypes = {
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
    const { classes, appLocation } = this.props;

    return (
      <AppBar position="fixed" className={classes.navBar}>
        <Toolbar className={classes.navBarWrapper}>
          <NavSection>
            <Link to={RouterPath.qtumPrediction}>
              <img
                src="http://res.cloudinary.com/dd1ixvdxn/image/upload/c_scale,h_38/v1514426750/logo_en_oa4ewt.svg"
                alt="bodhi-logo"
                className={classes.navBarLogo}
              />
            </Link>
            <NavLink to={RouterPath.qtumPrediction}>
              <Button
                data-index={EventStatus.Bet}
                className={classNames(
                  classes.navEventsButton,
                  appLocation === AppLocation.qtumPrediction || appLocation === AppLocation.bet ? 'selected' : '',
                )}
              >
                <FormattedMessage id="navbar.qtumPrediction" defaultMessage="QTUM Prediction" />
              </Button>
            </NavLink>
            <NavLink to={RouterPath.botCourt}>
              <Button
                data-index={EventStatus.Vote}
                className={classNames(
                  classes.navEventsButton,
                  appLocation === AppLocation.botCourt || appLocation === AppLocation.vote ? 'selected' : '',
                )}
              >
                <FormattedMessage id="navbar.botCourt" defaultMessage="BOT Court" />
              </Button>
            </NavLink>
          </NavSection>
          <NavSection>
            <NavLink to="/my-wallet">
              <Button className={classes.navBarWalletButton}>
                <i className={classNames('icon', 'iconfont', 'icon-ic_wallet', classes.navBarWalletIcon)}></i>
                {`${this.getTotalQTUM()} QTUM / ${this.getTotalBOT()} BOT`}
              </Button>
            </NavLink>
            <Button onClick={this.props.langHandler} className={`${classes.dark} ${classes.sides}`}>
              <FormattedMessage id="language.select" defaultMessage="中文" />
            </Button>
            {this.renderActivitiesButtonWithBadge()}
          </NavSection>
        </Toolbar>
      </AppBar>
    );
  }

  renderActivitiesButtonWithBadge() {
    const { classes, actionableItemCount } = this.props;

    if (actionableItemCount.totalCount > 0) {
      return (
        <NavLink to={RouterPath.set}>
          <Badge badgeContent={actionableItemCount.totalCount} color="secondary">
            <Button className={`${classes.navEventsButton} ${classes.dark}`}>
              <FormattedMessage id="navBar.activities" defaultMessage="My Activities" />
            </Button>
          </Badge>
        </NavLink>
      );
    }

    return (
      <NavLink to={RouterPath.set}>
        <Button className={`${classes.navEventsButton} ${classes.dark}`}>
          <FormattedMessage id="navBar.activities" defaultMessage="My Activities" />
        </Button>
      </NavLink>
    );
  }

  getTotalQTUM() {
    const { walletAddresses } = this.props;

    let total = 0;
    if (walletAddresses && walletAddresses.length) {
      total = _.sumBy(walletAddresses, (wallet) => wallet.qtum ? wallet.qtum : 0);
    }

    return total.toFixed(2);
  }

  getTotalBOT() {
    const { walletAddresses } = this.props;

    let total = 0;
    if (walletAddresses && walletAddresses.length) {
      total = _.sumBy(walletAddresses, (wallet) => wallet.bot ? wallet.bot : 0);
    }

    return total.toFixed(2);
  }
}

const NavSection = withStyles(styles)(({ classes, ...props }) => <div {...props} className={classes.navSection} />);

const NavLink = ({ to, ...props }) => ( // eslint-disable-line react/prop-types
  <Route exact path={to}>
    {({ match }) => <Link to={to} active={match} {...props} />}
  </Route>
);

const Link = withStyles(styles)(({ active = false, id, message, classes, className, ...props }) => ( // eslint-disable-line
  <_Link
    {...props}
    className={classNames(className, classes.navBarLink, {
      [classes.navArrow]: active,
    })}
  />
));

const mapStateToProps = (state) => ({
  ...state.App.toJS(),
  actionableItemCount: state.Graphql.get('actionableItemCount'),
});

const mapDispatchToProps = (dispatch) => ({});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(NavBar)));
