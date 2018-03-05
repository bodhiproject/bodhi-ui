import React, { PropTypes } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import Grid from 'material-ui/Grid';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import Typography from 'material-ui/Typography';
import moment from 'moment';
import classNames from 'classnames';
import { withStyles } from 'material-ui/styles';

import styles from './styles';

class DashboardCard extends React.PureComponent {
  render() {
    const {
      classes,
      topicAddress,
      oracleAddress,
      name,
      totalQTUM,
      totalBOT,
      endTime,
      buttonText,
    } = this.props;

    return (
      <Grid item xs={12} sm={6} md={4} lg={3}>
        <Link to={`/oracle/${topicAddress}/${oracleAddress}`}>
          <Card>
            <div className={classNames(classes.dashBoardCardSection, 'top')}>
              <Typography variant="headline">
                {name}
              </Typography>
              {totalQTUM}, {totalBOT}
              {endTime}
            </div>
            <Divider></Divider>
            <div className={classNames(classes.dashBoardCardSection, 'button')}>
              {buttonText}
            </div>
          </Card>
        </Link>
      </Grid>
    );
  }

  getEndingCountDown(endTime) {
    const nowunix = moment().unix();
    const unixdiff = endTime - nowunix;

    if (unixdiff < 0) {
      return 'Ended';
    }

    const dur = moment.duration(unixdiff * 1000);

    return `${dur.days()}d ${dur.hours()}h ${dur.minutes()}m Left.`;
  }
}

DashboardCard.propTypes = {
  classes: PropTypes.object.isRequired,
  topicAddress: PropTypes.string.isRequired,
  oracleAddress: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  totalQTUM: PropTypes.number.isRequired,
  totalBOT: PropTypes.number,
  endTime: PropTypes.number.isRequired,
  buttonText: PropTypes.string.isRequired,
};

Dashboard.defaultProps = {
  totalBOT: undefined,
};

export default withStyles(styles, { withTheme: true })(injectIntl(DashboardCard));
