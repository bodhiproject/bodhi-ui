import React from 'react';
import NProgress from 'nprogress';
import ReactPlaceholder from 'react-placeholder';
import 'nprogress/nprogress.css';
import 'react-placeholder/lib/reactPlaceholder.css';

export default function asyncComponent(importComponent) {
  class AsyncFunc extends React.Component {
    constructor(props) {
      super(props);

      NProgress.configure({ showSpinner: false });
      this.state = {
        component: null,
      };
    }

    componentWillMount() {
      NProgress.start();
    }

    async componentDidMount() {
      this.mounted = true;
      const { default: Component } = await importComponent();
      NProgress.done();
      if (this.mounted) {
        this.setState({
          component: <Component {...this.props} />,
        });
      }
    }

    componentWillUnmount() {
      this.mounted = false;
    }

    render() {
      const Component = this.state.component || <div />;
      return (
        <ReactPlaceholder type="text" rows={7} ready={Component !== null}>
          {Component}
        </ReactPlaceholder>
      );
    }
  }

  return AsyncFunc;
}
