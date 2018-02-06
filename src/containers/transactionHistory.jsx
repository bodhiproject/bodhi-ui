import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

class TransactionHistory extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentWillMount() {
  }

  componentWillReceiveProps(nextProps) {
  }

  render() {
    return null;
  }
}

TransactionHistory.propTypes = {
};

TransactionHistory.defaultProps = {
};

const mapStateToProps = (state) => ({
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionHistory);
