import React from 'react';
import { connect } from 'react-redux';

import CreateTopic from '../components/bodhi/createTopic';

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
      <CreateTopic onSubmit={this.onSubmit} />
    );
  }
}

CreateTopicContainer.propTypes = {

};

CreateTopicContainer.defaultProps = {

};


// Wrap the component to inject dispatch and state into it
export default connect(null, null)(CreateTopicContainer);
