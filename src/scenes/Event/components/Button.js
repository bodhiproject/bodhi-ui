import styled from 'styled-components';
import { Button as _Button } from '@material-ui/core';


export const Button = styled(_Button).attrs({ variant: 'raised', fullWidth: true, size: 'large', color: 'primary' })`
  margin-top: ${props => props.theme.padding.md.px} !important;
  background-color: ${props => props.theme.palette.primary.main} !important; // TODO: fix
  color: white !important; // TODO fix
`;
