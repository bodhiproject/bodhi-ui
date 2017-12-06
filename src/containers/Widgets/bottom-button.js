import React, { PropTypes } from 'react';

export default class BottomButtonWidget extends React.PureComponent {
  render() {
    const {
      height,
    } = this.props;

    const style = {
      height,
      lineHeight: height,
      borderStyle: 'solid',
      borderWidth: '0x',
      borderLeftWidth: 0,
      borderTopWidth: 0.5,
      borderRightWidth: 0,
      borderBottomWidth: 0,
      borderColor: 'rgba(0, 0, 0, 0.2)',
      marginLeft: '-24px',
      marginRight: '-24px',
      textAlign: 'center',
      fontSize: '18px',
      fontWeigh: 500,
      color: '#4A4A4A',
    };

    return (
      <div style={style}>
        <a href="#">Participate</a>
      </div>
    );
  }
}

BottomButtonWidget.propTypes = {
  height: PropTypes.string,
};

BottomButtonWidget.defaultProps = {
  height: '48px',
};
