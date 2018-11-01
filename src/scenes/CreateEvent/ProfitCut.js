import React from 'react';
import { observer, inject } from 'mobx-react';
import { injectIntl, defineMessages } from 'react-intl';
import { FormControl, TextField, FormHelperText, withStyles, Select, Button, InputAdornment } from '@material-ui/core';
import cx from 'classnames';
import { Section } from './components';

import styles from './styles';

const messages = defineMessages({
  createNamePlaceholderMsg: {
    id: 'create.namePlaceholder',
    defaultMessage: 'e.g. Who will be the next president of the United States?',
  },
  eventUnconfirmedMessage: {
    id: 'oracle.eventUnconfirmed',
    defaultMessage: 'This created Event is unconfirmed. You cannot interact with it until it is confirmed by the blockchain.',
  },
  createprofitCut: {
    id: 'create.profitCut',
    defaultMessage: 'Profit Cut',
  },
  createProfitCutMsg: {
    id: 'create.profitCutMsg',
    defaultMessage: "profitCut should between 0% to 100% '",
  },
});

const ProfitCut = withStyles(styles, { withTheme: true })(observer(({ classes, store: { createEvent }, intl }) => {
  console.log('ere');
  return (
    <Section title={messages.createprofitCut}>
      <TextField
        id="outlined-name"
        className={classes.textField}
        margin="normal"
        variant="outlined"
        type="number"
        onChange={createEvent.handleProfitCutChange}
        error={!!createEvent.error.profitCut}
        InputProps={{
          endAdornment: (
            <InputAdornment variant="filled" position="end">
              %
            </InputAdornment>
          ),
        }}
      />
      {!!createEvent.error.profitCut && <FormHelperText error>{intl.formatMessage({ id: createEvent.error.profitCut })}</FormHelperText>}
    </Section>

  );
}));

export default injectIntl(inject('store')(ProfitCut));
