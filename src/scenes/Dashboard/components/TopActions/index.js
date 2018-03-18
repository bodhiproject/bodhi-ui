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

import dashboardActions from '../../../../redux/Dashboard/actions';
import CreateEvent from '../../../../scenes/CreateEvent/index';
import { SortBy } from '../../../../constants';
import styles from './styles';

class TopActions extends Component {
  state = {
    createDialogOpen: false,
  };

  static propTypes = {
    classes: PropTypes.object.isRequired,
    sortBy: PropTypes.string,
    sortOrderChanged: PropTypes.func,
  };

  static defaultProps = {
    sortBy: SortBy.Ascending,
    sortOrderChanged: undefined,
  };

  constructor(props) {
    super(props);

    this.onSortOptionSelected = this.onSortOptionSelected.bind(this);
    this.onCreateDialogClose = this.onCreateDialogClose.bind(this);
    this.onCreateDialogOpen = this.onCreateDialogOpen.bind(this);
  }

  onSortOptionSelected(event) {
    this.props.sortOrderChanged(event.target.value);
  }

  onCreateDialogClose() {
    this.setState({ createDialogOpen: false });
  }

  onCreateDialogOpen() {
    this.setState({ createDialogOpen: true });
  }

  render() {
    const { classes, sortBy } = this.props;

    return (
      <Grid container className={classes.dashboardActionsWrapper}>
        <Grid item xs={8}>
          <Button variant="raised" size="medium" color="primary" className={classes.createEventButton} onClick={this.onCreateDialogOpen}>
            <AddIcon fontSize />
            <FormattedMessage id="create.title" defaultMessage="Create an event" />
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
        <CreateEvent open={this.state.createDialogOpen} onClose={this.onCreateDialogClose} />
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  sortBy: state.Dashboard.get('sortBy'),
});

function mapDispatchToProps(dispatch) {
  return {
    sortOrderChanged: (sortBy) => dispatch(dashboardActions.sortOrderChanged(sortBy)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles, { withTheme: true })(TopActions)));
