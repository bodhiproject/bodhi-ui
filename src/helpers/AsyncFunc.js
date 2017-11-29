/* eslint-disable react/no-did-mount-set-state */

import React from 'react';
import Nprogress from 'nprogress';
import ReactPlaceholder from 'react-placeholder';
import 'nprogress/nprogress.css';
import 'react-placeholder/lib/reactPlaceholder.css';

export default function asyncComponent(importComponent) {
  class AsyncFunc extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        component: null,
      };
    }
    componentWillMount() {
      Nprogress.start();
    }

    async componentDidMount() {
      this.mounted = true;
      const { default: Component } = await importComponent();
      Nprogress.done();
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
