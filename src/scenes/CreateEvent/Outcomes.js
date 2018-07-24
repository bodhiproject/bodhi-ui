import React from 'react';
import styled from 'styled-components';
import { observer, inject } from 'mobx-react';
import { injectIntl } from 'react-intl';
import { TextField, InputAdornment, FormControl, FormHelperText, Button as _Button } from '@material-ui/core';
import Section from './Section';

const MIN_OPTION_NUMBER = 2;
const MAX_OPTION_NUMBER = 10;


const Outcomes = observer(({ store: { createEvent } }) => (
  <Section column title='str.outcomes'>
    {createEvent.outcomes.map((outcome, i) => (
      <Outcome key={i} outcome={outcome} createEvent={createEvent} i={i} />
    ))}
    {createEvent.outcomes.length < MAX_OPTION_NUMBER && (
      <AddButton onClick={() => createEvent.outcomes.push('')} />
    )}
  </Section>
));

const AddButton = injectIntl(({ intl, ...props }) => (
  <Button {...props}>+ {intl.formatMessage({ id: 'create.addOutcome' })}</Button>
));

const Button = styled(_Button).attrs({ variant: 'raised' })`
  margin-top: ${props => props.theme.padding.unit.px} !important;
  width: 150px;
`;

const Outcome = injectIntl(observer(({ outcome, createEvent, i, intl }) => (
  <div>
    <FormControl fullWidth>
      <TextField
        fullWidth
        value={outcome}
        onChange={e => createEvent.outcomes[i] = e.target.value}
        onBlur={() => createEvent.validateOutcome(i)}
        placeholder={intl.formatMessage({ id: 'create.outcomeName' })}
        error={Boolean(createEvent.error.outcomes[i])}
        InputProps={{
          startAdornment: <InputAdornment position="start">#{i + 1}</InputAdornment>,
        }}
      />
      {!!createEvent.error.outcomes[i] && <FormHelperText error>{intl.formatMessage({ id: createEvent.error.outcomes[i] })}</FormHelperText>}
    </FormControl>
    {createEvent.outcomes.length > MIN_OPTION_NUMBER && (
      <RemoveIcon onClick={() => createEvent.outcomes.splice(i, 1)} />
    )}
  </div>
)));

const RemoveIcon = styled.i.attrs({ className: 'icon iconfont icon-close' })`
  position: absolute;
  right: 25px;
  margin-top: 9px;
  cursor: pointer;
`;

export default inject('store')(Outcomes);
