import React, { PropTypes } from 'react';
import { Link } from 'react-router-dom';

export default class BottomButtonWidget extends React.PureComponent {
  render() {
    const {
      height,
      pathname,
      query,
      text,
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
        <Link to={{ pathname, query }}>{text}</Link>
      </div>
    );
  }
}

BottomButtonWidget.propTypes = {
  height: PropTypes.string,
  pathname: PropTypes.string,
  query: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  text: PropTypes.string,
};

BottomButtonWidget.defaultProps = {
  height: '48px',
  pathname: '',
  query: '',
  text: 'Participate',
};
