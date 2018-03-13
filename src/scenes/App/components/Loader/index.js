import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import { FormattedMessage } from 'react-intl';

import AppConfig from '../../../../config/app';
import styles from './styles';

const MIN_BLOCK_COUNT_GAP = 1;

class Loader extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    syncPercent: PropTypes.number.isRequired,
  };

  render() {
    const { classes, syncPercent } = this.props;
    const hideLoader = !AppConfig.debug.showAppLoad || syncPercent >= 100;

    return (
      <div
        className={classes.loaderBg}
        style={
          {
            opacity: hideLoader ? 0 : 1,
            display: hideLoader ? 'none' : 'block',
          }
        }
      >
        <div className={classes.loaderWrapper}>
          <div className={classes.loaderLogoWrapper}>
            <img className={classes.loaderGif} src="/images/loader.gif" alt="Loading..." />
          </div>
          <div className={classes.loaderInfoWrapper}>
            <Typography variant="display1" className={classes.loaderPercent}>{syncPercent}</Typography>%
            <p><FormattedMessage id="str.blockSync" defaultMessage="Blockchain syncing." /></p>
            <p><FormattedMessage id="str.wait" defaultMessage="Please wait." /></p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  syncPercent: state.App.get('syncPercent'),
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Loader));
