import styled from 'styled-components';
import { Grid } from '@material-ui/core';


export const Content = styled(Grid).attrs({ item: true, xs: 12, md: 8 })`
  padding: ${props => props.theme.padding.lg.px};
  overflow-x: hidden;
`;
