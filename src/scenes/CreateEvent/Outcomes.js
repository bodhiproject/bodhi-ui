import React from 'react';
import cx from 'classnames';
import { observer, inject } from 'mobx-react';
import { injectIntl, defineMessages, FormattedMessage } from 'react-intl';
import { TextField, InputAdornment, FormControl, FormHelperText, Button, withStyles } from '@material-ui/core';
import { Add } from '@material-ui/icons';

import { Section } from './components';
import styles from './styles';

const MIN_OPTION_NUMBER = 2;
const MAX_OPTION_NUMBER = 10;

const messages = defineMessages({
  createOutcomeNameMsg: {
    id: 'create.outcomeName',
    defaultMessage: 'Outcome Name',
  },
  strOutcomesMsg: {
    id: 'str.outcomes',
    defaultMessage: 'Outcomes',
  },
});

const Outcomes = observer(({ store: { createEvent } }) => (
  <Section column title={messages.strOutcomesMsg}>
    {createEvent.outcomes.map((outcome, i) => (
      <Outcome key={i} outcome={outcome} createEvent={createEvent} i={i} />
    ))}
    {createEvent.outcomes.length < MAX_OPTION_NUMBER && (
      <div>
        <AddButton onClick={() => createEvent.addOutcome('')} />
      </div>
    )}
  </Section>
));

const RemoveIcon = withStyles(styles)(inject('store')(({ classes, index, store: { createEvent } }) => (
  <i
    className={cx('icon iconfont icon-close', classes.removeOutcomeIcon)}
    onClick={() => createEvent.outcomes.splice(index, 1)}
  />
)));

const AddButton = injectIntl(withStyles(styles)(({ intl, classes, ...props }) => (
  <Button className={classes.addOutcomeButton} variant="contained" color="primary" size="small" {...props}>
    <Add className={classes.buttonIcon} />
    <FormattedMessage id="create.addOutcome" defaultMessage="Add Outcome" />
  </Button>
)));

const Outcome = injectIntl(withStyles(styles, { withTheme: true })(observer(({ classes, outcome, createEvent, i, intl }) => (
  <div>
    <FormControl fullWidth>
      <TextField
        fullWidth
        value={outcome}
        onChange={e => createEvent.outcomes[i] = e.target.value}
        onBlur={() => createEvent.validateOutcome(i)}
        placeholder={intl.formatMessage(messages.createOutcomeNameMsg)}
        error={Boolean(createEvent.error.outcomes[i])}
        InputProps={{
          classes: { input: classes.createEventTextField },
          startAdornment: <InputAdornment position="start" classes={{ positionStart: classes.createEventInputAdornment }}>#{i + 1}</InputAdornment>,
        }}
      />
      {createEvent.outcomes.length > MIN_OPTION_NUMBER && <RemoveIcon index={i} />}
      {!!createEvent.error.outcomes[i] && <FormHelperText error>{intl.formatMessage({ id: createEvent.error.outcomes[i] })}</FormHelperText>}
    </FormControl>
  </div>
))));

export default inject('store')(Outcomes);
