import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import Button from 'material-ui/Button';
import Grid from 'material-ui/Grid';
import AddIcon from 'material-ui-icons/Add';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import { MenuItem } from 'material-ui/Menu';
import Card from 'material-ui/Card';
import { withStyles } from 'material-ui/styles';

import appActions from '../../../../redux/App/actions';
import dashboardActions from '../../../../redux/Dashboard/actions';
import topicActions from '../../../../redux/Topic/actions';
import { SortBy } from '../../../../constants';
import styles from './styles';

class TopActions extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    sortBy: PropTypes.string,
    sortOrderChanged: PropTypes.func,
    lastUsedAddress: PropTypes.string.isRequired,
    toggleCreateEventDialog: PropTypes.func.isRequired,
    getEventEscrowAmount: PropTypes.func.isRequired,
  };

  static defaultProps = {
    sortBy: SortBy.Ascending,
    sortOrderChanged: undefined,
  };

  onSortOptionSelected = (event) => {
    this.props.sortOrderChanged(event.target.value);
  };

  onCreateDialogOpen = () => {
    const {
      toggleCreateEventDialog,
      lastUsedAddress,
      getEventEscrowAmount,
    } = this.props;

    toggleCreateEventDialog(true);
    getEventEscrowAmount(lastUsedAddress);
  };

  render() {
    const { classes, sortBy } = this.props;

    return (
      <Grid container className={classes.dashboardActionsWrapper}>
        <Grid item xs={8}>
          <Button
            variant="raised"
            size="medium"
            color="primary"
            className={classes.createEventButton}
            onClick={this.onCreateDialogOpen}
          >
            <AddIcon fontSize />
            <FormattedMessage id="create.dialogTitle" defaultMessage="Create an event" />
          </Button>
        </Grid>
        <Grid item xs={4} className={classes.dashboardActionsRight}>
          <span className={classes.dashboardActionsSortLabel}>
            <FormattedMessage id="sort.label" defaultMessage="Sort By" />
          </span>
          <Card className={classes.dashboardActionsSort}>
            <FormControl>
              <Select disableUnderline value={sortBy} onChange={this.onSortOptionSelected}>
                <MenuItem value={SortBy.Ascending}><FormattedMessage id="sort.ascEndTime" defaultMessage="End Earliest" /></MenuItem>
                <MenuItem value={SortBy.Descending}><FormattedMessage id="sort.descEndTime" defaultMessage="End Latest" /></MenuItem>
              </Select>
            </FormControl>
          </Card>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  lastUsedAddress: state.App.get('lastUsedAddress'),
  sortBy: state.Dashboard.get('sortBy'),
});

function mapDispatchToProps(dispatch) {
  return {
    toggleCreateEventDialog: (isVisible) => dispatch(appActions.toggleCreateEventDialog(isVisible)),
    sortOrderChanged: (sortBy) => dispatch(dashboardActions.sortOrderChanged(sortBy)),
    getEventEscrowAmount: (senderAddress) => dispatch(topicActions.getEventEscrowAmount(senderAddress)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles, { withTheme: true })(TopActions)));
