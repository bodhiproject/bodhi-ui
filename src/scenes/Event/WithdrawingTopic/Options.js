import React from 'react';
import styled, { css } from 'styled-components';
import _ from 'lodash';
import { injectIntl, defineMessages } from 'react-intl';
import { Typography } from '@material-ui/core';

const messages = defineMessages({
  withdrawDetailTotalBetTotalVoteMsg: {
    id: 'withdrawDetail.totalBetTotalVote',
    defaultMessage: 'Total bet amount {qtum} QTUM. Total voted amount {bot} BOT.',
  },
  withdrawDetailYouBetYouVoteMsg: {
    id: 'withdrawDetail.youBetYouVote',
    defaultMessage: 'You bet {qtum} QTUM. You voted {bot} BOT.',
  },
});

const Options = ({ eventPage }) => (
  <Wrapper>
    {_.map(eventPage.topic.options, (o, i) => <Option key={`option-${i}`} eventPage={eventPage} index={i} option={o} />)}
  </Wrapper>
);

const Option = injectIntl(({ option, eventPage, index, intl, eventPage: { topic } }) => (
  <OptionWrapper>
    <OptionNumber>{index + 1}</OptionNumber>
    <Typog variant="h6" data-small={topic.resultIdx === index}>
      {option === 'Invalid' ? topic.localizedInvalid.parse(intl.locale) : option}
    </Typog>
    <Typography variant="caption">
      {intl.formatMessage(messages.withdrawDetailTotalBetTotalVoteMsg, {
        qtum: topic.qtumAmount[index], bot: topic.botAmount[index],
      })}
    </Typography>
    {!!(eventPage.betBalances[index] || eventPage.voteBalances[index]) && (
      <div>
        <Typography variant="caption">
          {intl.formatMessage(messages.withdrawDetailYouBetYouVoteMsg, { qtum: eventPage.betBalances[index], bot: eventPage.voteBalances[index] })}
        </Typography>
      </div>
    )}
  </OptionWrapper>
));

const Typog = styled(Typography)`
  ${({ theme, ...props }) => props['data-small'] && css`
    color: ${theme.palette.primary.main};
  `}
`;

const OptionNumber = styled.div`
  ${({ theme }) => css`
    background: ${theme.palette.background.grey};
    height: ${theme.sizes.icon.large};
    width: ${theme.sizes.icon.large};
    line-height: ${theme.sizes.icon.large};
    border-radius: ${theme.sizes.icon.large};
    overflow: hidden;
    text-align: center;
    font-size: ${theme.sizes.font.xxSmall.px};
    font-weight: ${theme.typography.fontWeightBold};
    color: ${theme.palette.text.primary};
    position: absolute;
    left: 0;
    top: 0;
  `}
`;

const OptionWrapper = styled.div`
  width: 100%;
  display: block;
  position: relative;
  padding-left: ${props => props.theme.padding.space5X.px};
  margin-bottom: ${props => props.theme.padding.space5X.px};
  &.last {
    margin: 0;
  };
  &.option {
    margin-bottom: ${props => props.theme.padding.space3X.px};
  };
`;

const Wrapper = styled.div`
  padding: ${props => props.theme.padding.space5X.px};
`;

export default Options;
