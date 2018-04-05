import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

import styles from './styles';

class EventInfo extends React.PureComponent {
  render() {
    const { classes, infoObjs } = this.props;

    if (!infoObjs || infoObjs.length === 0) {
      return null;
    }

    return (
      <div className={classes.eventInfoWrapper}>
        {
          _.map(infoObjs, (infoObj, index) => (
            infoObj.label && infoObj.content ?
              <Grid key={`info${index}`} item xs={6} md={12} className={classes.eventInfoBlock}>
                <Typography variant="body1">
                  {infoObj.label}
                </Typography>
                <Typography variant="title" className={classes.eventInfo}>
                  {infoObj.content}
                </Typography>
                {
                  infoObj.highlight ? (
                    <Typography variant="body2" color="secondary">
                      {infoObj.highlight}
                    </Typography>) : null
                }
              </Grid> : null
          ))
        }
      </div>
    );
  }
}

EventInfo.propTypes = {
  classes: PropTypes.object.isRequired,
  infoObjs: PropTypes.array.isRequired,
};

export default withStyles(styles, { withTheme: true })(injectIntl(EventInfo));
