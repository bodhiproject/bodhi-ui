import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Tabs, { Tab } from 'material-ui/Tabs';
import Typography from 'material-ui/Typography';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { withStyles } from 'material-ui/styles';

import styles from './styles';

class Activities extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabIdx: 0,
    };

    this.handleTabChange = this.handleTabChange.bind(this);
  }

  render() {
    const { classes } = this.props;
    const { tabIdx } = this.state;

    return (
      <div>
        <Tabs indicatorColor="primary" value={tabIdx} onChange={this.handleTabChange} className={classes.activitiesTabWrapper}>
          <Tab label="Result Setting" />
          <Tab label="Withdraw" />
          <Tab label="Activities History" />
        </Tabs>
        {tabIdx === 0 && <div>Result Setting</div>}
        {tabIdx === 1 && <div>Withdraw</div>}
        {tabIdx === 2 && <div>Activities history</div>}
      </div>
    );
  }

  handleTabChange(event, value) {
    console.log(value);
    this.setState({ tabIdx: value });
  }
}

Activities.propTypes = {
  classes: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Activities)));
