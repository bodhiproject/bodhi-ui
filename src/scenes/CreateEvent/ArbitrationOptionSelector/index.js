import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import {
  FormControl,
  Grid,
  Card,
  CardContent,
  Typography,
  withStyles,
} from '@material-ui/core';
import { Token } from 'constants';
import { injectIntl, defineMessages } from 'react-intl';
import { map } from 'lodash';
import { Section } from '../components';
import styles from '../styles';

const messages = defineMessages({
  arbitrationTime: {
    id: 'create.arbitrationTime',
    defaultMessage: 'Arbitration Time',
  },
  xHoursForXNbot: {
    id: 'create.xHoursForXNbot',
    defaultMessage: '{hours} hours for {nbot} NBOT',
  },
});

@withStyles(styles, { withTheme: true })
@injectIntl
@inject('store')
@observer
export default class ArbitrationOptionSelector extends Component {
  onChange = (event, value) => {
    this.props.store.createEvent.setArbOptionSelected(Number(value));
  };

  renderArbitrationLengthCards = (classes, createEvent, opt, idx) => (
    <Grid key={idx} item xs={6} sm={3}>
      <Card
        className={classes.card}
        onClick={() => this.props.store.createEvent.setArbOptionSelected(Number(idx))}
      >
        <CardContent>
          <Typography>
            {`${opt.threshold} ${Token.NBOT}`}
          </Typography>
          <Typography
            variant="subtitle1"
            className={createEvent.arbOptionSelected === idx ? classes.cardSelected : ''}
          >
            {`${opt.length / 3600} Hours`}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  render() {
    const {
      store: { createEvent, createEvent: { arbOptions } },
      classes,
    } = this.props;

    return (
      <Section column title={messages.arbitrationTime}>
        <FormControl component="fieldset">
          <Grid container>
            <Grid item xs={12}>
              <Grid container direction="row" alignItems="center" spacing={2}>
                {map(arbOptions, (opt, idx) => this.renderArbitrationLengthCards(classes, createEvent, opt, idx))}
              </Grid>
            </Grid>
          </Grid>
        </FormControl>
      </Section>
    );
  }
}
