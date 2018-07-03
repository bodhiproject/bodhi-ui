/* eslint-disable */
import React from 'react';
import styled, { css } from 'styled-components';
// import React, { Component } from 'react';
// import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core';
// import { injectIntl } from 'react-intl';
// import cx from 'classnames';

// import styles from './styles';


// @injectIntl
// @withStyles(styles, { withTheme: true })
// export default class ImportantNote extends Component {
//   static propTypes = {
//     classes: PropTypes.object.isRequired,
//     heading: PropTypes.string,
//     message: PropTypes.string,
//   };

//   static defaultProps = {
//     heading: undefined,
//     message: undefined,
//   };

//   render() {
//     const {
//       classes,
//       heading,
//       message,
//     } = this.props;

//     if (!heading && !message) {
//       return null;
//     }

//     return (
//       <div>
//         <i className={cx(classes.infoIcon, 'icon iconfont icon-ic_info')}></i>
//         <span className={classes.headingText}>{heading}</span>
//         <p className={classes.messageText}>{message}</p>
//       </div>
//     );
//   }
// }

export const ImportantNote = ({ heading, message }) => !!(heading && message) && (
  <Wrapper>
    <Icon />
    <Heading>{heading}</Heading>
    <Message>{message}</Message>
  </Wrapper>
)
const Wrapper = styled.div`
  ${({ theme: { padding } }) => css`
    margin: ${padding.xs.px} ${padding.xs.px} 0px ${padding.xs.px};
  `}
`
const Heading = styled.span`
  font-size: ${props => props.theme.sizes.font.textMd};
  font-weight: ${props => props.theme.typography.fontWeightBold};
  color: ${props => props.theme.palette.text.primary};
`
const Message = styled.p`
  font-size: ${props => props.theme.sizes.font.textSm};
  color: ${props => props.theme.palette.text.secondary};
`
const Icon = styled.i.attrs({ className: 'icon iconfont icon-ic_info' })`
  font-size: ${props => props.theme.sizes.font.textMd};
  color: ${props => props.theme.palette.primary.main};
  margin-right: ${props => props.theme.padding.unit.px};
`