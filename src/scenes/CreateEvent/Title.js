/* eslint-disable */
import React from 'react';
import { observer, inject } from 'mobx-react';
// import styled from 'styled-components';
import { injectIntl } from 'react-intl';
import { FormControl, TextField as _TextField, FormHelperText, InputAdornment } from '@material-ui/core';
import Section from './Section';


const Title = observer(({ store: { createEvent } }) => (
  <Section title='create.title'>
    <TextField
      placeholder=''
      value={createEvent.title}
      onChange={e => createEvent.title = e.target.value}
      error={createEvent.error.title}
    />
  </Section>
));

const TextField = ({ input, placeholder, startAdornmentLabel, meta: { touched, error }, ...custom }) => (
  <FormControl fullWidth>
    <_TextField
      {...input}
      {...custom}
      fullWidth
      placeholder={placeholder}
      error={Boolean(touched && error)}
      InputProps={{
        startAdornment: startAdornmentLabel && <InputAdornment position="start">{startAdornmentLabel}</InputAdornment>,
      }}
    />
    {touched && error && <FormHelperText error>{error}</FormHelperText>}
  </FormControl>
);

export default injectIntl(inject('store')(Title));
