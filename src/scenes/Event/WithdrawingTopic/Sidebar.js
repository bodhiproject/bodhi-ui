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

  const nakaTotal = _.sum(topic.nakaAmount);
  const nbotTotal = _.sum(topic.nbotAmount);

  let resultSetterAddress;
  _.map(topic.oracles, (o) => {
    const setterAddress = o.resultSetterAddress;
    if (setterAddress) {
      resultSetterAddress = setterAddress;
    }
  });

  return [
    {
      label: <FormattedMessage id="eventInfo.predictionFund" defaultMessage="Prediction Fund" >{(txt) => i18nToUpperCase(txt)}</FormattedMessage>,
      content: `${nakaTotal} NAKA`,
    }, {
      label: <FormattedMessage id="eventInfo.voteVolume" defaultMessage="Voting Volume" >{(txt) => i18nToUpperCase(txt)}</FormattedMessage>,
      content: `${nbotTotal} NBOT`,
    }, {
      label: <FormattedMessage id="str.resultSetter" defaultMessage="Result Setter" >{(txt) => i18nToUpperCase(txt)}</FormattedMessage>,
      content: resultSetterAddress,
    },
  ];
};
export default Sidebar;
