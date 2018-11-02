import React from 'react';
import { observer, inject } from 'mobx-react';
import { FormControl, FormHelperText, Select, withStyles, OutlinedInput } from '@material-ui/core';
import { injectIntl, defineMessages } from 'react-intl';
import { Section } from './components';

import styles from './styles';

const messages = defineMessages({
  strCreatorMsg: {
    id: 'str.creator',
    defaultMessage: 'Creator',
  },
});

const CreatorDropdown = (({ classes, store: { createEvent, wallet: { addresses } }, intl }) => (
  <Section title={messages.strCreatorMsg}>
    <FormControl fullWidth>
      <Select
        native
        fullWidth
        classes={{ select: classes.createEventTextField }}
        error={Boolean(createEvent.error.creator)}
        value={createEvent.creator}
        onChange={e => createEvent.creator = e.target.value}
        onBlur={createEvent.validateCreator}
        input={
          <OutlinedInput
            labelWidth={0}
          />
        }
      >
        {addresses.map(creator => <CreatorItem key={creator.address} {...creator} />)}
      </Select>
      {Boolean(createEvent.error.creator) && (
        <FormHelperText error>{intl.formatMessage({ id: createEvent.error.creator })}</FormHelperText>
      )}
    </FormControl>
  </Section>
));

const CreatorItem = observer(({ address, qtum, bot }) => (
  <option value={address}>
    {`${address}`}
    {` (${qtum ? qtum.toFixed(2) : 0} QTUM, ${bot ? bot.toFixed(2) : 0} BOT)`}
  </option>
));

export default withStyles(styles)(injectIntl(inject('store')(observer(CreatorDropdown))));
