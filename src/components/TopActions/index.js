import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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

import appActions from '../../redux/App/actions';
import dashboardActions from '../../redux/Dashboard/actions';
import topicActions from '../../redux/Topic/actions';
import { SortBy } from '../../constants';
import Tracking from '../../helpers/mixpanelUtil';
import styles from './styles';

@injectIntl
@withStyles(styles, { withTheme: true })
@connect((state) => ({
  lastUsedAddress: state.App.get('lastUsedAddress'),
  sortBy: state.Dashboard.get('sortBy'),
}), (dispatch) => ({
  toggleCreateEventDialog: (isVisible) => dispatch(appActions.toggleCreateEventDialog(isVisible)),
  sortOrderChanged: (sortBy) => dispatch(dashboardActions.sortOrderChanged(sortBy)),
  getEventEscrowAmount: (senderAddress) => dispatch(topicActions.getEventEscrowAmount(senderAddress)),
}))
@inject('store')
@observer
export default class TopActions extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    sortBy: PropTypes.string,
    sortOrderChanged: PropTypes.func,
    lastUsedAddress: PropTypes.string.isRequired,
    toggleCreateEventDialog: PropTypes.func.isRequired,
    getEventEscrowAmount: PropTypes.func.isRequired,
    noCreateEventButton: PropTypes.bool,
  };

  static defaultProps = {
    sortBy: SortBy.ASCENDING,
    sortOrderChanged: undefined,
    noCreateEventButton: false,
  };

  onSortOptionSelected = ({ target: { value } }) => {
    this.props.store.sortBy = value;
    this.props.sortOrderChanged(value);
  };

  onCreateDialogOpen = () => {
    const {
      toggleCreateEventDialog,
      lastUsedAddress,
      getEventEscrowAmount,
    } = this.props;

    toggleCreateEventDialog(true);
    getEventEscrowAmount(lastUsedAddress);

    Tracking.track('dashboard-createEventClick');
  };

  render() {
    const { classes, sortBy, noCreateEventButton, fontSize } = this.props;

    return (
      <Grid container className={classes.dashboardActionsWrapper}>
        <Grid item xs={8}>
          {!noCreateEventButton && (
            <Button
              variant="raised"
              size="medium"
              color="primary"
              className={classes.createEventButton}
              onClick={this.onCreateDialogOpen}
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
              <Select disableUnderline value={sortBy} onChange={this.onSortOptionSelected}>
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
