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
      <div className="isoWidgetsWrapper" style={wrapperStyle}>
        {children}
      </div>
    );
  }
}

IsoWidgetsWrapper.propTypes = {
  width: PropTypes.number,
  gutterTop: PropTypes.number,
  gutterRight: PropTypes.number,
  gutterBottom: PropTypes.number,
  gutterLeft: PropTypes.number,
  padding: PropTypes.number,
  bgColor: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
  ]),
};

IsoWidgetsWrapper.defaultProps = {
  width: 0,
  gutterTop: 0,
  gutterRight: 0,
  gutterBottom: 0,
  gutterLeft: 0,
  padding: 0,
  bgColor: '#fff',
  children: [],
};
