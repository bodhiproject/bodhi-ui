import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import CreateTopic from '../components/bodhi/createTopic';
import LayoutContentWrapper from '../components/utility/layoutWrapper';

class CreateTopicContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
  }

  onSubmit() {

  }

  render() {
    return (
      <LayoutContentWrapper className="horizontalWrapper" style={{ minHeight: '100vh', paddingTop: '50px', paddingBottom: '50px' }}>
        <CreateTopic onSubmit={this.onSubmit} />
      </LayoutContentWrapper>
    );
  }
}

CreateTopicContainer.propTypes = {

};

CreateTopicContainer.defaultProps = {

};

const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
  return {
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(CreateTopicContainer);
