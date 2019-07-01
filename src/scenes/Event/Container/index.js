import styled from 'styled-components';

export default styled.div`
  width: 100%;
  display: block;
  position: relative;
  padding-left: ${props => props.theme.padding.space5X.px};
  margin-bottom: ${props => props.theme.padding.space5X.px};
  &.last {
    margin: 0;
  };
  &.option {
    margin-bottom: ${props => props.theme.padding.space3X.px};
  };
  @media(max-width: 599.95px) {
    margin-bottom: ${props => props.theme.padding.space2X.px};
  }
`;
