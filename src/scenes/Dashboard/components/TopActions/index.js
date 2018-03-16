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
import { SortBy } from '../../../../constants';
import styles from './styles';

class TopActions extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    path: PropTypes.string,
    sortBy: PropTypes.string,
    sortOrderChanged: PropTypes.func,
  };

  static defaultProps = {
    path: undefined,
    sortBy: SortBy.Ascending,
    sortOrderChanged: undefined,
  };

  constructor(props) {
    super(props);

    this.onSortOptionSelected = this.onSortOptionSelected.bind(this);
  }

  onSortOptionSelected(event) {
    this.props.sortOrderChanged(event.target.value);
  }

  render() {
    const { classes, path, sortBy } = this.props;

    let createEventVisibility = true;
    if (path && path === '/bot-court') {
      createEventVisibility = false;
    }

    return (
      <Grid container className={classes.dashboardActionsWrapper}>
        <Grid item xs={8}>
          {
            createEventVisibility ?
              <Link to="/create-topic" >
                <Button variant="raised" size="medium" color="primary" className={classes.createEventButton}>
                  <AddIcon fontSize className={classes.createEventIcon} />
                  <FormattedMessage id="create.title" defaultMessage="Create an event" />
                </Button>
              </Link>
              : null
          }
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
  match: PropTypes.object.isRequired,
  sortBy: state.Dashboard.get('sortBy'),
});

function mapDispatchToProps(dispatch) {
  return {
    sortOrderChanged: (sortBy) => dispatch(dashboardActions.sortOrderChanged(sortBy)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles, { withTheme: true })(TopActions)));
