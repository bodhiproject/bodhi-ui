import React from 'react';
import { observer, inject } from 'mobx-react';
// import styled from 'styled-components';
import Section from './Section';


const ResultSetStartTime = observer(({ store: { createEvent } }) => (
  <Section title='create.resultSetStartTime'>
  </Section>
));

export default inject('store')(ResultSetStartTime);
