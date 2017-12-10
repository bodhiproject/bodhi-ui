import React, { PropTypes } from 'react';

export default class IsoWidgetsWrapper extends React.PureComponent {
  render() {
    const {
      width,
      gutterTop,
      gutterRight,
      gutterBottom,
      gutterLeft,
      padding,
      bgColor,
      children,
    } = this.props;

    const wrapperStyle = {
      width,
      marginTop: gutterTop,
      marginRight: gutterRight,
      marginBottom: gutterBottom,
      marginLeft: gutterLeft,
      padding,
      backgroundColor: bgColor,
    };

    return (
      <div className="cardWrapper" style={{ padding: '2px' }}>
        <div className="inner" style={wrapperStyle}>
          {children}
        </div>
      </div>
    );
  }
}

IsoWidgetsWrapper.propTypes = {
  width: PropTypes.string,
  gutterTop: PropTypes.string,
  gutterRight: PropTypes.string,
  gutterBottom: PropTypes.string,
  gutterLeft: PropTypes.string,
  padding: PropTypes.string,
  bgColor: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.array,
  ]),
};

IsoWidgetsWrapper.defaultProps = {
  width: '100%',
  gutterTop: '0px',
  gutterRight: 'auto',
  gutterBottom: '0px',
  gutterLeft: 'auto',
  padding: '24px 24px 0px 24px',
  bgColor: '#fff',
  children: [],
};
