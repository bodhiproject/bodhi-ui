import React from 'react';
import PropTypes from 'PropTypes';
import { connect } from 'react-redux';


class MyWallet extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return null;
  }
}

MyWallet.propTypes = {
  match: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  intl: intlShape.isRequired,
};

MyWallet.defaultProps = {
};

const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)
  (withStyles(styles, { withTheme: true })
  (injectIntl(MyWallet)));
