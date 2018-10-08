import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import AddIcon from '@material-ui/icons/Add';

import { inject, observer } from 'mobx-react';

import {
  Button,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Card,
  withStyles,
} from '@material-ui/core';

import { SortBy } from 'constants';
import styles from './styles';

@injectIntl
@withStyles(styles, { withTheme: true })
@inject('store')
@observer
export default class TopActions extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    noCreateEventButton: PropTypes.bool,
  };

  static defaultProps = {
    noCreateEventButton: false,
  };

  render() {
    const { classes, noCreateEventButton, fontSize, store, store: { qtumPrediction } } = this.props;
    const { createEvent } = store;

    return (
      <Grid container className={classes.dashboardActionsWrapper}>
        <Grid item xs={6}>
          {!noCreateEventButton && (
            <Button
              variant="raised"
              size="medium"
              color="primary"
              className={classes.createEventButton}
              onClick={createEvent.open}
            >
              <AddIcon className={classes.createEventButtonIcon} fontSize={fontSize} />
              <FormattedMessage id="str.createEvent" defaultMessage="Create Event" />
            </Button>
          )}
        </Grid>
        <Grid item xs={6} className={classes.dashboardActionsRight}>
          <span className={classes.dashboardActionsSortLabel}>
            <FormattedMessage id="sort.label" defaultMessage="Sort By" />
          </span>
          <Card className={classes.dashboardActionsSort}>
            <FormControl>
              <Select disableUnderline className={classes.dashboardActionsSelect} value={qtumPrediction.sortBy} onChange={e => qtumPrediction.sortBy = e.target.value}>
                <MenuItem className={classes.dashboardActionsMenuItem} value={SortBy.DESCENDING}><FormattedMessage id="sort.byEndTime" defaultMessage="End Time" /></MenuItem>
              </Select>
            </FormControl>
          </Card>
        </Grid>
      </Grid>
    );
  }
}
