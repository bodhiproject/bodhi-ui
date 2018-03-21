import styled, { css } from 'styled-components';
import { LinearProgress } from 'material-ui/Progress';


export const Progress = styled(LinearProgress)`
  ${(props) => props['data-invalid'] && css`
    & > div {
      background-color: red !important;
    }
  `}
`;
