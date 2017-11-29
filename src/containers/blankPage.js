import React from 'react';
import { Button } from 'antd';
import { Row, Col } from 'antd';

import LayoutContent from '../components/utility/layoutContent';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import Spacing from '../components/bodhi-dls/spacing';

class BlankPage extends React.PureComponent {
  render() {
    return (
      <LayoutContentWrapper style={{ height: '100vh' }}>
        <LayoutContent>
          <Spacing bottom={2}>
            <h1>Bodhi UI Elements</h1>
          </Spacing>
          <Spacing bottom={2}>
            <hr />
          </Spacing>
          <Spacing bottom={2}>
            <h2>Buttons</h2>
          </Spacing>
          <Spacing bottom={2}>
            <h3>Basic Buttons</h3>
          </Spacing>
          <Button>Small</Button>
        </LayoutContent>
      </LayoutContentWrapper>
    );
  }
}

export default BlankPage;
