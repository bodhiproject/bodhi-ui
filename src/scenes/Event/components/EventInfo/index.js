import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import { Grid, Typography, withStyles } from '@material-ui/core';

import styles from './styles';

@injectIntl
@withStyles(styles, { withTheme: true })
export default class EventInfo extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    infoObjs: PropTypes.array.isRequired,
  }

  render() {
    const { classes, infoObjs } = this.props;

    if (!infoObjs || infoObjs.length === 0) {
      return null;
    }

    return (
      <div className={classes.eventInfoWrapper}>
        {_.map(infoObjs, ({ label, highlight, content }, index) => label && content && (
          <Grid key={`info${index}`} item xs={6} md={12} className={classes.eventInfoBlock}>
            <Typography variant="body1">
              {label}
            </Typography>
            <Typography variant="title" className={classes.eventInfo}>
              {content}
            </Typography>
            {highlight && (
              <Typography variant="body2" color="secondary">
                {highlight}
              </Typography>
            )}
          </Grid>
        ))}
      </div>
    );
  }
}
