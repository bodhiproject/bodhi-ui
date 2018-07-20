import React from 'react';
import { observer, inject } from 'mobx-react';
// import styled from 'styled-components';
import Section from './Section';


const PredictionEndTime = observer(({ store: { createEvent } }) => (
  <Section title='create.betEndTime'>
  </Section>
));

export default inject('store')(PredictionEndTime);
