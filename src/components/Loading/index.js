import React from 'react';
import { injectIntl } from 'react-intl';
import styled, { keyframes } from 'styled-components';

export const Loading = injectIntl(({ text, intl, ...props }) => (
  <Col {...props}>
    <Animation className='animation' {...props} />
    {text && intl.formatMessage({ id: text.id, defaultMessage: text.defaultMessage })}
  </Col>
));

const loading = keyframes`
  0% { transform: rotate(0deg) }
  100% { transform: rotate(360deg) }
`;

const Animation = styled.div`
  position: ${props => props.position || 'relative'};
  box-sizing: ${props => props.boxSizing || 'border-box'};
  width: ${props => props.width || '3rem'};
  height: ${props => props.height || '3rem'};;
  display: ${props => props.display || 'inline-flex'};
  margin-top: ${props => props.marginTop || '10px'};
  margin-right: ${props => props.marginRight || '20px'};
  margin-bottom: ${props => props.marginBottom || '10px'};
  margin-left: ${props => props.marginLeft || '20px'};
  border-radius: ${props => props.borderRadius || '100%'};
  background: linear-gradient(${props => props.theme.palette.primary.main}, #fff);
  animation: ${loading} 2s linear infinite;
  &:before {
    content: '';
    position: absolute;
    box-sizing: border-box;
    width: 80%;
    height: 80%;
    left: 10%;
    top: 10%;
    background: #fff;
    border-radius: 100%;
  }
`;

const Col = styled.div`
  display: flex;
  flex-direction: column;
  color: gray;
  align-items: center;
`;
