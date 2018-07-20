import React from 'react';
import { observer, inject } from 'mobx-react';
// import styled from 'styled-components';
import Section from './Section';


const PredictionStartTime = observer(({ createEvent }) => (
  <Section title='create.betStartTime'>
  </Section>
));

export default inject('store')(PredictionStartTime);
