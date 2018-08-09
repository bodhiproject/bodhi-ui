import styled from 'styled-components';


export const Container = styled.div`
  width: 100%;
  display: block;
  position: relative;
  padding-left: ${props => props.theme.padding.md.px};
  margin-bottom: ${props => props.theme.padding.md.px};
  &.last {
    margin: 0;
  };
  &.option {
    margin-bottom: ${props => props.theme.padding.sm.px};
  };
`;
