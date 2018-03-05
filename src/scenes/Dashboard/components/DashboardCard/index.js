import React, { PropTypes } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import Grid from 'material-ui/Grid';
import Card from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';

import styles from './styles';
import { getLocalDateTimeString, getEndTimeCountDownString } from '../../../../helpers/utility';

class DashboardCard extends React.PureComponent {
  render() {
    const {
      classes,
      url,
      name,
      totalQTUM,
      totalBOT,
      endTime,
      buttonText,
    } = this.props;

    return (
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Link to={url}>
          <Card>
            <div className={classNames(classes.dashboardCardSection, 'top')}>
              <Typography variant="headline" className={classes.dashboardCardName}>
                {name}
              </Typography>
              <div className={classes.dashboardTime}>
                {endTime !== undefined ? `Ends: ${getLocalDateTimeString(endTime)}` : null}
              </div>
              <div className={classes.dashboardCardInfo}>
                <div>
                  <i className={classNames(classes.dashBoardCardIcon, 'icon', 'iconfont', 'icon-coin')}></i>
                  {`Rasied ${parseFloat(totalQTUM.toFixed(2))} QTUM`}
                  {totalBOT !== undefined ? `, ${parseFloat(totalBOT.toFixed(2))} BOT` : null}
                </div>
                <div>
                  <i className={classNames(classes.dashBoardCardIcon, 'icon', 'iconfont', 'icon-clock')}></i>
                  {endTime !== undefined ? `${getEndTimeCountDownString(endTime)}` : 'Ended'}
                </div>
              </div>
            </div>
            <Divider />
            <div className={classNames(classes.dashboardCardSection, 'button')}>
              {buttonText}
            </div>
          </Card>
        </Link>
      </Grid>
    );
  }
}

DashboardCard.propTypes = {
  classes: PropTypes.object.isRequired,
  url: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  totalQTUM: PropTypes.number.isRequired,
  totalBOT: PropTypes.number,
  endTime: PropTypes.string,
  buttonText: PropTypes.string.isRequired,
};

DashboardCard.defaultProps = {
  totalBOT: undefined,
  endTime: undefined,
};

export default withStyles(styles, { withTheme: true })(injectIntl(DashboardCard));
