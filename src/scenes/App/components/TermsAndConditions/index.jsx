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
              {this.renderRepresentations()}
              {this.renderAwards()}
              {this.renderPowers()}
              {this.renderResponsibilities()}
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

  renderRepresentations = () => (
    <div>
      <Typography variant="title">
        <FormattedMessage id="tnc.representations" defaultMessage="Your Representations" />
      </Typography>
      <ol>
        <li><FormattedMessage id="tnc.representations1" defaultMessage="You represent, warrant, acknowledge and undertake that: (i) You have verified and determined that Your use of the Site and/or Platform does not violate any laws or regulations of any jurisdiction that applies to You, (ii) You are solely responsible for recording, paying and accounting to any relevant governmental, taxation or other authority for any tax or other levy that may be payable due to Your use of the Site and/or Platform, (iii) You will use the Site and Platform in good faith towards Bodhi and others using the Site and/or Platform, (iv) Bodhi may, at its sole and absolute discretion, decide whether to allow You to use the Site and/or Platform and/or whether to cease Your use of the Site and/or Platform, (v) BOT is offered as a utility token only and is not offered for speculative purposes, and (vi) You shall indemnify Us and hold Us harmless, from and against all claims, liabilities, damages, losses, costs and expenses, including legal fees, arising out of or in connection with any breach of these Terms and Conditions by You, and any other liabilities arising out of Your use of the Site and/or Platform." /></li>
      </ol>
    </div>
  );

  renderAwards = () => (
    <div>
      <Typography variant="title">
        <FormattedMessage id="tnc.awards" defaultMessage="Awards Policy" />
      </Typography>
      <ol>
        <li><FormattedMessage id="tnc.awards1" defaultMessage="All promotions, prizes, awards or special offers are subject to promotion-specific terms and conditions. Please review such promotion-specific terms and conditions that are applicable to the relevant promotion." /></li>
        <li><FormattedMessage id="tnc.awards2" defaultMessage="Bodhi reserves the right to withdraw any promotion, award, prize or special offer at any time. In the event that Bodhi believes You are abusing or attempting to abuse any award or other promotion,  or are likely to benefit through abuse or lack of good faith, then Bodhi may, at its sole and absolute discretion, deny, withhold or withdraw from You any award or promotion and/or rescind any policy with respect to You, either temporarily or permanently." /></li>
        <li><FormattedMessage id="tnc.awards3" defaultMessage="Bodhi reserves the right to prevent players from certain jurisdictions from participating and being eligible for any or all promotions and awards, at its sole and absolute discretion." /></li>
      </ol>
    </div>
  );

  renderPowers = () => (
    <div>
      <Typography variant="title">
        <FormattedMessage id="tnc.powers" defaultMessage="Powers and Authorities of the Company" />
      </Typography>
      <ol>
        <li><FormattedMessage id="tnc.powers1" defaultMessage="Bodhi shall make commercially reasonable efforts to prevent any malfunctioning in the Site’s and Platform’s activity. However, in any event of a technical failure (or any other error, including the creation of an Invalid Event) in the Site’s and/or Platform’s systems for any reason whatsoever, Bodhi will be entitled to cancel any Events and or Predictions, concerning which the malfunctioning has occurred, without being liable to You in any form or manner." /></li>
        <li><FormattedMessage id="tnc.powers2" defaultMessage="Bodhi reserves the right to cancel, terminate, modify or suspend the Site and/or Platform if for any reason, the Site and/or Platform cannot be operated as planned, including, but not limited to, infection by computer virus, bugs, tampering or unauthorized intervention, fraud, technical failures as well as any other causes beyond Bodhi’s control. If any errors result in awarding QTUM or BOT (“tokens”) to You or in an increase in tokens paid to You, You shall not be entitled to these tokens. You agree to immediately inform Bodhi of the error and shall repay any tokens credited to You in error to Bodhi (as directed by Bodhi) or Bodhi may, at its discretion, set off such amount against any tokens owed to You." /></li>
        <li><FormattedMessage id="tnc.powers3" defaultMessage="Bodhi reserves the right to limit, refuse or cancel any Event and/or Prediction made by You, where Bodhi believes that any act of fraud or any other act of bad faith has been taken against Bodhi or any third party, whether by You or by any third party, without being liable to You in any form or manner." /></li>
        <li><FormattedMessage id="tnc.powers4" defaultMessage="Bodhi shall be entitled, at its sole discretion, to amend, modify, or discontinue, from time to time, any of part of the Site and/or Platform, and/or awards and/or promotions and/or introduce new features of the Site and/or Platform and/or new awards and/or promotions. We shall not be liable for any loss suffered by You resulting from any changes made and You shall have no claims against Us in such regard." /></li>
      </ol>
    </div>
  );

  renderResponsibilities = () => (
    <div>
      <Typography variant="title">
        <FormattedMessage id="tnc.responsibilities" defaultMessage="Reservations Concerning Our Responsibility" />
      </Typography>
      <ol>
        <li><FormattedMessage id="tnc.responsibilities1" defaultMessage="We are not responsible for any error, omission, interruption, deletion, defect, delay in operation or transmission, communications line failure, theft or destruction or unauthorized access to, or alteration of data or information and any direct or indirect loss which arises from these occurrences. We are not responsible for any problems or technical malfunction of any network or lines, Wi-Fi, Bluetooth, computers, systems, servers or providers, computer equipment, software or email on account of technical problems or traffic congestion on the internet or at any web site, application, mobile site or mobile application. We shall not be responsible or liable to You in the event of systems or communications errors, bugs or viruses relating to the Site and/or Platform or which will result in damage to Your hardware and/or software and/or data." /></li>
        <li><FormattedMessage id="tnc.responsibilities2" defaultMessage="In no event shall We be liable for any direct, indirect, incidental, special or consequential damages or damages for loss of profits, revenue, data or use incurred by You or any third party, whether in an action for contract or tort, arising from the access to, or use of, the Site and/or Platform and/or otherwise." /></li>
        <li><FormattedMessage id="tnc.responsibilities3" defaultMessage="We make no representations about the suitability, reliability, availability, timeliness and accuracy of the information, software, products, Site and/or Platform. All information, software, products, Site and/or Platform are provided “as is” without warranty of any kind. We hereby disclaim all warranties with respect to information, software, products, Events and/or Predictions offered at the Site, whether express or implied." /></li>
        <li><FormattedMessage id="tnc.responsibilities4" defaultMessage="We shall have no liability with respect to any damage or loss that was caused due to reliance, of any type, on the information or any other publication or content appearing at the Site and/or Platform, and You are invited to verify the information published at the Site and/or Platform." /></li>
        <li><FormattedMessage id="tnc.responsibilities5" defaultMessage="We shall not be responsible or liable for any actions or omissions of any internet service provider or any other third party which provides You with access to Site and/or Platform." /></li>
        <li><FormattedMessage id="tnc.responsibilities6" defaultMessage="We shall not be responsible for any damage or loss You shall incur as a result of modifications, enhancement, termination, suspension or discontinuation of the Site and/or Platform. We will not be responsible for any damage or loss You shall incur as a result of Your use or reliance on the content of any website, mobile site and/or mobile application to which links appear on the Site." /></li>
        <li><FormattedMessage id="tnc.responsibilities7" defaultMessage="You will indemnify and hold Us harmless against all direct and indirect claims, liabilities, damages, losses, costs and expenses arising from Your breach of these Terms and Conditions." /></li>
        <li><FormattedMessage id="tnc.responsibilities8" defaultMessage="The Site and Platform are provided “as is”, and We make no warranty or representation, whether express or implied (whether by law, statute, or otherwise), including but not limited to implied warranties and conditions of merchantability, satisfactory quality, fitness for a particular purpose, completeness or accuracy, non-infringement of third parties’ rights or of applicable laws and regulation in respect of the Site and/or Platform, or that the Site and/or Platform will be uninterrupted, timely, secure or error-free, or that defects will be corrected, or will be free of viruses or bugs or as to results or the accuracy of any information through the Site and/or Platform." /></li>
        <li><FormattedMessage id="tnc.responsibilities9" defaultMessage="You are responsible for maintaining your own wallet. Bodhi is a decentralized application, with no centralized mechanism for accessing your wallet. Bodhi does not keep, store, save, or in any way backup your account details. Therefore Bodhi is unable to assist in any way to recover wallet access. Mismanagement of your wallet details may cause you to lose all your funds that may not be recoverable. We are not responsible for the loss of such funds arising from entering the wrong wallet details." /></li>
      </ol>
    </div>
  );
}
