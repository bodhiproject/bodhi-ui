import React from 'react';
import { observer, inject } from 'mobx-react';
// import styled from 'styled-components';
import Section from './Section';


const ResultSetter = observer(({ store: { createEvent } }) => (
  <Section title='str.outcomes'>
  </Section>
));

export default inject('store')(ResultSetter);
