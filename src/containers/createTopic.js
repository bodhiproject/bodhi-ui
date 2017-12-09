import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import LayoutContentWrapper from '../components/utility/layoutWrapper';

class CreateTopic extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentWillMount() {
  }

  render() {
    return (
      <LayoutContentWrapper className="horizontalWrapper" style={{ minHeight: '100vh', paddingTop: '50px', paddingBottom: '50px' }}>
        Something here
      </LayoutContentWrapper>
    );
  }
}

CreateTopic.propTypes = {

};

CreateTopic.defaultProps = {

};

const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(CreateTopic);
