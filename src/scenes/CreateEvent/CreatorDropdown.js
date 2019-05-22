/* eslint-disable */
import React from 'react';
import { observer, inject } from 'mobx-react';
import { FormControl, FormHelperText, Select, withStyles } from '@material-ui/core';
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
      >
        {addresses.map(creator => <CreatorItem key={creator.address} {...creator} />)}
      </Select>
      {Boolean(createEvent.error.creator) && (
        <FormHelperText error>{intl.formatMessage({ id: createEvent.error.creator })}</FormHelperText>
      )}
    </FormControl>
  </Section>
));

const CreatorItem = observer(({ address, naka, nbot }) =>{
 console.log('TCL: CreatorItem -> nbot', nbot);
 return (
  <option value={address}>
    {`${address}`}
    {` (${naka ? naka.toFixed(2) : 0} NAKA, ${nbot ? nbot.toFixed(2) : 0} NBOT)`}
  </option>
)});

export default withStyles(styles)(injectIntl(inject('store')(observer(CreatorDropdown))));
