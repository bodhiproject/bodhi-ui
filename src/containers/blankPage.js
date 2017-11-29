import React from 'react';
import { Row, Col } from 'antd';

// import { Link, Redirect } from 'react-router-dom';
// import { connect } from 'react-redux';
// import Input from '../components/uielements/input';
// import Checkbox from '../components/uielements/checkbox';
import Button from '../components/uielements/button';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import LayoutContent from '../components/utility/layoutContent';
// import ContentHolder from '../components/utility/contentHolder';
import basicStyle from '../config/basicStyle';
import IntlMessages from '../components/utility/intlMessages';
import IsoWidgetsWrapper from './Widgets/widgets-wrapper';

class BlankPage extends React.PureComponent {
  render() {
    const { rowStyle, colStyle, gutter } = basicStyle;

    return (
      <LayoutContentWrapper style={{ height: '100vh' }}>
        <LayoutContent>
          <Row>
            <Col xs={24} style={colStyle}>
              <h1>Mockup Page</h1>
            </Col>
          </Row>
          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col md={12} sm={12} xs={24} style={colStyle}>
              <IsoWidgetsWrapper>
                <Button type="primary" >
                  <IntlMessages id="page.signInButton" />
                </Button>
                <Button type="default">
                  <IntlMessages id="page.signInButton" />
                </Button>
              </IsoWidgetsWrapper>
            </Col>
            <Col md={12} sm={12} xs={24} style={colStyle}>
              <IsoWidgetsWrapper />
            </Col>
          </Row>
          <Row style={rowStyle} gutter={gutter} justify="start">
            <Col md={12} sm={12} xs={24} style={colStyle}>
              <IsoWidgetsWrapper>
                <p></p>
              </IsoWidgetsWrapper>
            </Col>
            <Col md={12} sm={12} xs={24} style={colStyle}>
              <IsoWidgetsWrapper />
            </Col>
          </Row>
        </LayoutContent>
      </LayoutContentWrapper>
    );
  }
}

BlankPage.propTypes = {

};

export default BlankPage;
