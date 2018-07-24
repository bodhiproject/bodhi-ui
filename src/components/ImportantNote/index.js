import React from 'react';
import styled, { css } from 'styled-components';


export const ImportantNote = ({ heading, message, ...props }) => !!(heading && message) && (
  <Wrapper {...props}>
    <Icon />
    <Heading>{heading}</Heading>
    <Message>{message}</Message>
  </Wrapper>
);

const Wrapper = styled.div`
  ${({ theme: { padding } }) => css`
    margin: ${padding.xs.px} ${padding.xs.px} 0px ${padding.xs.px};
  `}
`;

const Heading = styled.span`
  font-size: ${props => props.theme.sizes.font.textMd};
  font-weight: ${props => props.theme.typography.fontWeightBold};
  color: ${props => props.theme.palette.text.primary};
`;

const Message = styled.p`
  font-size: ${props => props.theme.sizes.font.textSm};
  color: ${props => props.theme.palette.text.secondary};
`;

const Icon = styled.i.attrs({ className: 'icon iconfont icon-ic_info' })`
  font-size: ${props => props.theme.sizes.font.textMd};
  color: ${props => props.theme.palette.primary.main};
  margin-right: ${props => props.theme.padding.unit.px};
`;
