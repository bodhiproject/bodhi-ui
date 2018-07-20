import React from 'react';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import { injectIntl } from 'react-intl';

const Section = injectIntl(({ title, children, intl }) => (
  <SectionContainer>
    <Grid item xs={3}>
      {intl.formatMessage(title)}
    </Grid>
    <Grid item xs={9}>
      {children}
    </Grid>
  </SectionContainer>
));

const SectionContainer = styled(Grid).attrs({ container: true })`
  margin-bottom: ${props => props.theme.padding.unit.px};
`;

export default Section;
