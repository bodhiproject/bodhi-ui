import styled from 'styled-components';
import { Grid } from '@material-ui/core';


export const SidebarContainer = styled(Grid).attrs({ item: true, xs: 12, md: 4 })`
  padding: ${props => props.theme.padding.lg.px};
  overflow-x: hidden;
  border-left: ${props => props.theme.border};
  text-align: right;
`;
