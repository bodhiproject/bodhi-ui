/* eslint-disable */
import React from 'react';
import { observer, inject } from 'mobx-react';
import _ from 'lodash';
import { MenuItem, FormControl, FormHelperText, Select } from '@material-ui/core';
import { injectIntl, intlShape, defineMessages } from 'react-intl';
import Section from './Section';


const CreatorDropdown = observer(({ store: { createEvent } }) => (
  <Section title='str.creator'>
    <FormControl fullWidth>
      <Select
        fullWidth
        error={Boolean(createEvent.error.creator)}
        onChange={e => createEvent.creator = e.target.value}
        onBlur={createEvent.validateCreator}
      >
        {createEvent.creatorAddressess.map(creator => <CreatorItem key={creator.address} {...creator} />)}
      </Select>
      {Boolean(createEvent.error.creator) && (
        <FormHelperText error>{createEvent.error.creator}</FormHelperText>
      )}
    </FormControl>
  </Section>
));

const CreatorItem = ({ address, qtum, bot }) => (
  <MenuItem value={address}>
    {`${address}`}
    {` (${qtum ? qtum.toFixed(2) : 0} QTUM, ${bot ? bot.toFixed(2) : 0} BOT)`}
  </MenuItem>
);

export default inject('store')(CreatorDropdown);
