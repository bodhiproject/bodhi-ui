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
              {this.renderSubordination()}
              {this.renderParticipate()}
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

  renderSubordination = () => (
    <div>
      <Typography variant="title">
        <FormattedMessage id="tnc.subordination" defaultMessage="Subordination to the Terms and Conditions and the Binding Effect Thereof" />
      </Typography>
      <ol>
        <li><FormattedMessage id="tnc.subordination1" defaultMessage="By using the Site, registering at the Site, or by making use of the Platform, You agree to be bound by and to act in accordance with the Terms and Conditions, as they may be updated from time to time, without any reservation." /></li>
        <li><FormattedMessage id="tnc.subordination2" defaultMessage="Bodhi reserves its right to amend these Terms and Conditions at any time, in its sole and absolute discretion. You will be informed of such amendment by placing the amended version of the Terms and Conditions on the Site. Failure to confirm such amendment will prevent You from continuing using the Site and/or Platform. If You do not wish to be bound by such amendment You must cease use of the Site and Platform." /></li>
        <li><FormattedMessage id="tnc.subordination3" defaultMessage="These Terms and Conditions supersede all prior agreements between the parties in relation to its subject matter and constitute the entire and whole agreement between You and Bodhi. You confirm that, in agreeing to accept these Terms and Conditions, You have not relied on any representation except for any express representation made by the Company in these Terms and Conditions." /></li>
      </ol>
    </div>
  );

  renderParticipate = () => (
    <div>
      <Typography variant="title">
        <FormattedMessage id="tnc.participate" defaultMessage=" Who is Entitled to Participate?" />
      </Typography>
      <ol>
        <li>
          <FormattedMessage id="tnc.participate1" defaultMessage="You may only use the Site and/or Platform if You comply with all of the following:" />
          <ol>
            <li><FormattedMessage id="tnc.participate1a" defaultMessage="You are at least eighteen (18) years old or of legal age as determined by the laws of the country where You live (whichever is higher); and" /></li>
            <li><FormattedMessage id="tnc.participate1b" defaultMessage="You do not violate any law or regulation as a result of using the Site and/or Platform. In this context, You agree that if You reside or are present in any jurisdiction that prohibits using the Site and/or Platform (including without limitation any of the Restricted Territories) You shall not participate in the prohibited activity." /></li>
          </ol>
        </li>
        <li><FormattedMessage id="tnc.participate2" defaultMessage="The Site and/or Platform are intended only for users who are not prohibited by the laws of any applicable jurisdiction from creating Events, making Trades and Predictions, or otherwise Participating on the Platform. The Company does not intend to enable You to contravene applicable law. You represent, warrant and agree to ensure that Your use of the Site and/or Platform will comply with all applicable laws, statutes and regulations. The offering or availability of the Site and/or Platform shall not be deemed or interpreted as an offer or invitation by Us to use the Site and/or Platform, if You reside in a place in which such use is currently forbidden by law (including without limitation the Restricted Territories), or where Bodhi, in its sole discretion, elects not to offer Site and/or Platform. You shall be solely responsible for determining whether Your use of the Site and/or Platform is legal in the place where You live and/or use the Site and/or Platform. We make no representations or warranties, express or implied, concerning the legality of the Site and/or Platform and/or of any person’s use of the Site and/or Platform, and shall not be responsible for any illegal use of the Site and/or Platform by You. It is Your responsibility to ensure that You comply with any and all laws applicable to You before using the Site and/or Platform. If You have any concerns, You should consult with your own legal counsel in the applicable jurisdiction about the legality of Your use of the Site and/or Platform. The Company reserves the right at any time to request from You evidence of age and if satisfactory proof of age is not provided within 72 hours of requesting such proof, then You shall be prohibited from using the Site and Platform. In the event that it is found that You are under the age of 18, or the legal age as determined by the laws of the country where You live (whichever is higher), then the Company shall cease Your use of the Site and Platform." /></li>
      </ol>
    </div>
  );
}
