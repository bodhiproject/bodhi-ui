import PropTypes from 'prop-types';
import React from 'react';

const propTypes = {
  bottom: PropTypes.number,
  children: PropTypes.node,
  left: PropTypes.number,
  right: PropTypes.number,
  top: PropTypes.number,
};

const defaultProps = {
  bottom: 0,
  children: null,
  left: 0,
  right: 0,
  top: 0,
};

const UNIT = 8;

export default function Spacing({
  bottom,
  children,
  left,
  right,
  top,
}) {
  const style = {
    marginTop: top && top * UNIT,
    marginRight: right && right * UNIT,
    marginBottom: bottom && bottom * UNIT,
    marginLeft: left && left * UNIT,
  };
  return (
    <div style={style}>
      {children}
    </div>
  );
}

Spacing.propTypes = propTypes;
Spacing.defaultProps = defaultProps;
