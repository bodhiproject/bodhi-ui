import React from 'react';
import { observer, inject } from 'mobx-react';
// import styled from 'styled-components';
import _ from 'lodash';
import { MenuItem, FormControl, FormHelperText, Select } from '@material-ui/core';
import { injectIntl, intlShape, defineMessages } from 'react-intl';
import Section from './Section';


const CreatorDropdown = observer(({ store: { createEvent } }) => (
  <Section title='str.creator'>
    {/* <CreateEventCreatorPicker name={ID_CREATOR_ADDRESS} eventEscrowAmount={eventEscrowAmount} changeFormFieldValue={changeFormFieldValue} /> */}
  </Section>
));

export default inject('store')(CreatorDropdown);
