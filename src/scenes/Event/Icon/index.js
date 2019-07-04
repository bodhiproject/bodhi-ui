import React from 'react';
import styled from 'styled-components';

export default styled(({ type = '', className }) => (
  <i className={`icon iconfont icon-ic_${type} ${className}`} />
))`
  height: ${props => props.theme.sizes.icon.large};
  width: ${props => props.theme.sizes.icon.large};
  line-height: 1;
  font-size: ${props => props.theme.sizes.icon.large};
  color: ${props => props.theme.palette.text.primary};
  position: absolute;
  left: 0;
`;
