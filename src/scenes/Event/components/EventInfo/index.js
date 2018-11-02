import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { injectIntl } from 'react-intl';
import { Grid, Typography, withStyles } from '@material-ui/core';

import styles from './styles';

@injectIntl
@withStyles(styles, { withTheme: true })
export default class EventInfo extends PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    infoObjs: PropTypes.array.isRequired,
  }

  render() {
    const { classes, infoObjs } = this.props;

    if (_.isEmpty(infoObjs)) return <Fragment></Fragment>;

    return (
      <div className={classes.eventInfoWrapper}>
        {_.map(infoObjs, ({ label, highlight, content }, index) => label && content && (
          <Grid key={`info${index}`} item xs={6} md={12} className={classes.eventInfoBlock}>
            <Typography variant="body2">
              {label}
            </Typography>
            <Typography variant="h6" className={classes.eventInfo}>
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
