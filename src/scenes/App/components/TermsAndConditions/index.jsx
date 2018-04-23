import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { connect } from 'react-redux';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import { FormattedMessage } from 'react-intl';
import Grid from 'material-ui/Grid';
import { LinearProgress } from 'material-ui/Progress';

import AppConfig from '../../../../config/app';
import styles from './styles';
import { getLocalDateTimeString } from '../../../../helpers/utility';

@withStyles(styles, { withTheme: true })
@connect((state) => ({
}), (dispatch) => ({
}))

export default class TermsAndConditions extends React.PureComponent {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  render() {
    const { classes } = this.props;

    const tncAccepted = localStorage.getItem('termsAndConditionsAccepted');
    console.log(tncAccepted);

    return (
      <div
        className={classes.tncBg}
        style={
          {
            opacity: tncAccepted ? 0 : 1,
            display: tncAccepted ? 'none' : 'block',
          }
        }
      >
        <Grid container>
          <Grid item xs></Grid>
          <Grid item xs={8}>
            <Paper className={classes.tncWrapper}>
              {this.renderTitle()}
              {this.renderGeneral()}
              {this.renderDefinitions()}
            </Paper>
          </Grid>
          <Grid item xs></Grid>
        </Grid>
      </div>
    );
  }

  renderTitle = () => (
    <Typography variant="headline" className={this.props.classes.title}>
      <FormattedMessage id="tnc.title" defaultMessage="Bodhi Terms and Conditions" />
    </Typography>
  );

  renderGeneral = () => (
    <div>
      <Typography variant="title">
        <FormattedMessage id="tnc.general" defaultMessage="General" />
      </Typography>
      <ol>
        <li><FormattedMessage id="tnc.general1" defaultMessage="The Site is operated by the Bodhi Foundation (“Bodhi“), with registered address at 22 NORTH CANAL ROAD #02-00 SINGAPORE (048834). At this stage of the Platform development this Site is entirely for free, and no risking of any BOT or QTUM Tokens is required in order to use it. Therefore, all Events and/or Predictions made via the Site are entirely risk free, however this is subject to change in accordance with the development milestones in the White Paper." /></li>
        <li><FormattedMessage id="tnc.general2" defaultMessage="These terms and conditions (“Terms and Conditions“) govern your (“You“, “Your”, “Player“ or “Participant”) use of the platform provided to You by Bodhi.  These Terms and Conditions should be read carefully by You in their entirety prior to Your use of the Platform and/or Site. Please note that these Terms and Conditions constitute a legally binding agreement between You and the Company." /></li>
      </ol>
    </div>
  );

  renderDefinitions = () => (
    <div>
      <Typography variant="title">
        <FormattedMessage id="tnc.definitions" defaultMessage="Definitions" />
      </Typography>
      <FormattedMessage id="tnc.definitionsExplanation" defaultMessage="In these Terms and Conditions, the following words and phrases shall (unless the context otherwise requires) have the meanings set out beside them:" />
      <ul>
        <li><FormattedMessage id="tnc.definitions1" defaultMessage="“Event” shall mean a speculative question about the future that has a discrete and well-defined number of potential outcomes." /></li>
        <li><FormattedMessage id="tnc.definitions2" defaultMessage="“Platform” shall mean the platform developed by Bodhi allowing for the creation of Events and making Predictions via the Site." /></li>
        <li><FormattedMessage id="tnc.definitions3" defaultMessage="“Prediction” shall mean a prediction made via the Site in respect of an Event. " /></li>
        <li><FormattedMessage id="tnc.definitions4" defaultMessage="“Restricted Territories” shall mean any jurisdiction in which creating Events making Predictions and/or the use of the platform is illegal as well as any additional jurisdictions added by Bodhi at its sole and absolute discretion." /></li>
        <li><FormattedMessage id="tnc.definitions5" defaultMessage="“Site” shall mean any website and/or mobile site and/or mobile application owned, operated or hosted by the Company and through which the Platform is available." /></li>
        <li><FormattedMessage id="tnc.definitions6" defaultMessage="“BOT” shall mean the utility token which is the Bodhi Token (BOT) cryptocurrency." /></li>
        <li><FormattedMessage id="tnc.definitions7" defaultMessage="“We“, “Our“ or “Us” shall mean the Bodhi Foundation, and/or any subsidiaries, affiliates, employees, directors, officers, agents, suppliers, consultants and contractors." /></li>
      </ul>
    </div>
  );
}
