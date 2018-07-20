import React from 'react';
import { observer, inject } from 'mobx-react';
// import styled from 'styled-components';
import Section from './Section';


const ResultSetEndTime = observer(({ store: { createEvent } }) => (
  <Section title='create.resultSetEndTime'>
  </Section>
));

export default inject('store')(ResultSetEndTime);
