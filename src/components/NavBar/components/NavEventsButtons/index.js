import React, { Component, PropTypes } from 'react';
import Button from 'material-ui/Button';
import _ from 'lodash';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { withStyles } from 'material-ui/styles';
import classNames from 'classnames';

import dashboardActions from '../../../../redux/Dashboard/actions';
import styles from './styles';

class NavEventsButtons extends Component {
  constructor(props) {
    super(props);

    this.onBtnClicked = this.onBtnClicked.bind(this);
  }

  onBtnClicked(event) {
    const index = event.currentTarget.getAttribute('data-index');

    if (index) {
      this.props.tabIndexChanged(parseInt(index, 10));
    }
  }

  render() {
    const { classes } = this.props;

    return (
      <div>{
        this.props.buttons.map((entry, index) => (
          <Button
            key={entry.text}
            data-index={index}
            onClick={this.onBtnClicked}
            className={classNames(classes.navEventsButton, index === _.toNumber(this.props.tabIndex) ? 'selected' : '')}
          >
            <FormattedMessage id={`dashboard.${entry.text}`} />
          </Button>
        ))
      }</div>
    );
  }
}

NavEventsButtons.propTypes = {
  classes: PropTypes.object.isRequired,
  buttons: PropTypes.array.isRequired,
  tabIndex: PropTypes.number,
  tabIndexChanged: PropTypes.func,
};

NavEventsButtons.defaultProps = {
  tabIndex: 0,
  tabIndexChanged: undefined,
};

const mapStateToProps = (state) => ({
  tabIndex: state.Dashboard.get('tabIndex'),
});

function mapDispatchToProps(dispatch) {
  return {
    tabIndexChanged: (index) => dispatch(dashboardActions.tabIndexChanged(index)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withStyles(styles, { withTheme: true })(NavEventsButtons)));
