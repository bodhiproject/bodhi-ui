import styled from 'styled-components';
import { palette, font } from 'styled-theme';

const DashAppHolder = styled.div`
  font-family: ${font('primary', 0)};

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  a,
  p,
  li,
  input,
  textarea,
  span,
  div,
  img,
  svg {
    &::selection {
      background: ${palette('primary', 0)};
      color: #fff;
    }
  }

  .ant-row {
    ${'' /* margin-left: -8px;
    margin-right: -8px; */};
  }

  .ant-row > div {
    padding: 0;
  }

  .isoLeftRightComponent {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .isoCenterComponent {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
`;

export default DashAppHolder;
