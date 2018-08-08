import React from 'react';
import styled from 'styled-components';
import { Grid, Paper } from '@material-ui/core';


export const Row = styled(({ children, ...props }) => (
  <Paper {...props}>
    <Grid container spacing={0}>{children}</Grid>
  </Paper>
))`
  box-shadow: none !important; // TODO: fix this
  border-radius: ${props => props.theme.borderRadius};
`;
