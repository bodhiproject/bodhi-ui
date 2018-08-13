import React from 'react';
import styled from 'styled-components';
import { Grid } from '@material-ui/core';
import { injectIntl } from 'react-intl';

export const Section = injectIntl(({ title, children, column = false, intl }) => (
  <SectionContainer>
    <Grid item xs={3}>
      {intl.formatMessage(title)}
    </Grid>
    <Grid item xs={9} style={{ flexDirection: column ? 'column' : 'row', display: 'flex' }}>
      {children}
    </Grid>
  </SectionContainer>
));

const SectionContainer = styled(Grid).attrs({ container: true })`
  margin-bottom: ${props => props.theme.padding.unit.px};
`;
