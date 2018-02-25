import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

class GlobalHub extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return null;
  }
}

GlobalHub.propTypes = {

};

GlobalHub.defaultProps = {

};

const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GlobalHub);
