import React from 'react';
import styled from 'styled-components';


export const Icon = styled(({ type = '', className }) => (
  <i className={`icon iconfont icon-ic_${type} ${className}`} />
))`
  height: ${props => props.theme.sizes.icon};
  width: ${props => props.theme.sizes.icon};
  line-height: 1;
  font-size: ${props => props.theme.sizes.icon};
  color: ${props => props.theme.palette.text.primary};
  position: absolute;
  left: 0;
  top: -7px;
`;
