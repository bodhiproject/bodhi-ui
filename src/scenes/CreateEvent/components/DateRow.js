import React from 'react';
import styled from 'styled-components';
import { Grid, withStyles } from '@material-ui/core';
import { injectIntl } from 'react-intl';

import styles from './styles';

export const DateRow = injectIntl(withStyles(styles, { withTheme: true })(({ title, children, intl, classes }) => (
  <SectionContainer>
    <Grid item xs={12} sm={3} className={classes.createEventSectionTitle}>
      {intl.formatMessage(title)}
    </Grid>
    <Grid item xs={12} sm={9} className={classes.sectionFlexDirection}>
      {children}
    </Grid>
  </SectionContainer>
)));

const SectionContainer = styled(Grid).attrs({ container: true })`
  margin-bottom: ${props => props.theme.padding.spaceX.px};
`;
