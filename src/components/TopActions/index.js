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

import { SortBy } from '../../constants';
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
    const { classes, noCreateEventButton, fontSize, store } = this.props;
    const { sortBy, createEvent } = store;

    return (
      <Grid container className={classes.dashboardActionsWrapper}>
        <Grid item xs={8}>
          {!noCreateEventButton && (
            <Button
              variant="raised"
              size="medium"
              className={classes.createEventButton}
              onClick={createEvent.open}
            >
              <AddIcon fontSize={fontSize} />
              <FormattedMessage id="create.dialogTitle" defaultMessage="Create an event" />
            </Button>
          )}
        </Grid>
        <Grid item xs={4} className={classes.dashboardActionsRight}>
          <span className={classes.dashboardActionsSortLabel}>
            <FormattedMessage id="sort.label" defaultMessage="Sort By" />
          </span>
          <Card className={classes.dashboardActionsSort}>
            <FormControl>
              <Select disableUnderline value={sortBy} onChange={e => store.sortBy = e.target.value}>
                <MenuItem value={SortBy.ASCENDING}><FormattedMessage id="sort.ascEndTime" defaultMessage="End Earliest" /></MenuItem>
                <MenuItem value={SortBy.DESCENDING}><FormattedMessage id="sort.descEndTime" defaultMessage="End Latest" /></MenuItem>
              </Select>
            </FormControl>
          </Card>
        </Grid>
      </Grid>
    );
  }
}
