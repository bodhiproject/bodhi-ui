import React from 'react';
import { inject, observer } from 'mobx-react';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import { StepperVertRight } from 'components';
import { i18nToUpperCase } from '../../../helpers';
import { SidebarContainer } from '../components/Sidebar';
import EventInfo from './EventInfo';

const Sidebar = inject('store')(observer(({ topic }) => (
  <SidebarContainer>
    <EventInfo infoObjs={getEventInfoObjs(topic)} />
    <StepperVertRight />
  </SidebarContainer>
)));

const getEventInfoObjs = (topic) => {
  if (_.isEmpty(topic)) {
    return [];
  }

  const qtumTotal = _.sum(topic.qtumAmount);
  const botTotal = _.sum(topic.botAmount);

  let resultSetterQAddress;
  _.map(topic.oracles, (o) => {
    const setterAddress = o.resultSetterQAddress;
    if (setterAddress) {
      resultSetterQAddress = setterAddress;
    }
  });

  return [
    {
      label: <FormattedMessage id="eventInfo.predictionFund" defaultMessage="Prediction Fund" >{(txt) => i18nToUpperCase(txt)}</FormattedMessage>,
      content: `${qtumTotal} QTUM`,
    }, {
      label: <FormattedMessage id="eventInfo.voteVolume" defaultMessage="Voting Volume" >{(txt) => i18nToUpperCase(txt)}</FormattedMessage>,
      content: `${botTotal} BOT`,
    }, {
      label: <FormattedMessage id="str.resultSetter" defaultMessage="Result Setter" >{(txt) => i18nToUpperCase(txt)}</FormattedMessage>,
      content: resultSetterQAddress,
    },
  ];
};
export default Sidebar;
