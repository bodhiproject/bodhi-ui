import styled from 'styled-components';
import { Typography } from '@material-ui/core';


export const Title = styled(Typography).attrs({ variant: 'display1' })`
  margin-bottom: ${props => props.theme.padding.md.px} !important;
`;

