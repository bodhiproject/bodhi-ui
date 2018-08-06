import React, { Fragment } from 'react';
import styled from 'styled-components';
import _ from 'lodash';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Token } from 'constants';
import { Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

import { getShortLocalDateTimeString, i18nToUpperCase, localizeInvalidOption } from '../../../helpers';

const ResultHistory = injectIntl(({ intl, oracles }) => {
  const sortedOracles = _.orderBy(oracles, ['endTime']);
  if (sortedOracles.length) {
    const { resultIdx, options, amounts, consensusThreshold } = sortedOracles[0];
    const { endTime, token } = sortedOracles[1];
    const resultSettingRound = { endTime, token, resultIdx, options };
    resultSettingRound.amounts = _.clone(amounts);
    resultSettingRound.amounts.fill(0);
    resultSettingRound.amounts[resultSettingRound.resultIdx] = consensusThreshold;
    sortedOracles.splice(1, 0, resultSettingRound);
  }

  return (
    <DetailTxWrapper>
      <DetailTxTitle>
        <FormattedMessage id="str.resultHistory" defaultMessage="Result History">
          {(txt) => i18nToUpperCase(txt)}
        </FormattedMessage>
      </DetailTxTitle>
      {sortedOracles.length ? (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="dense">
                <FormattedMessage id="str.date" defaultMessage="Date" />
              </TableCell>
              <TableCell padding="dense">
                <FormattedMessage id="str.resultType" defaultMessage="Result Type" />
              </TableCell>
              <TableCell padding="dense">
                <FormattedMessage id="str.winningOutcome" defaultMessage="Winning Outcome" />
              </TableCell>
              <TableCell padding="dense">
                <FormattedMessage id="str.amount" defaultMessage="Amount" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {_.map(sortedOracles, (oracle, index) => {
              const invalidOption = localizeInvalidOption(oracle.options[oracle.resultIdx], intl);
              return (
                <TableRow key={`result-${index}`} selected={index % 2 === 1}>
                  <TableCell padding="dense">{getShortLocalDateTimeString(oracle.endTime)}</TableCell>
                  <TableCell padding="dense">{getTypeText(oracle, index)}</TableCell>
                  <TableCell padding="dense">
                    {index !== sortedOracles.length - 1 && index !== 0
                      ? `#${oracle.resultIdx + 1} ${oracle.options[oracle.resultIdx] === 'Invalid' ? invalidOption : oracle.options[oracle.resultIdx]}`
                      : ''
                    }
                  </TableCell>
                  <TableCell padding="dense">{`${_.sum(oracle.amounts)} ${oracle.token}`}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      ) : (
        <Fragment />
      )}
    </DetailTxWrapper>
  );
});

const getTypeText = (oracle, index) => {
  if (oracle.token === Token.QTUM) {
    return <FormattedMessage id="str.bettingRound" defaultMessage="Betting Round" />;
  } else if (index === 1) {
    return <FormattedMessage id="str.resultSettingRound" defaultMessage="Result Setting Round" />;
  }
  return <FormattedMessage id="str.arbitrationRoundX" defaultMessage="Arbitration Round {idx}" values={{ idx: index - 1 }} />;
};

const DetailTxTitle = styled(Typography).attrs({
  variant: 'headline',
})`
  margin-top: ${props => props.theme.padding.xs.px};
`;

const DetailTxWrapper = styled.div`
  margin-top: ${props => props.theme.padding.md.px};
`;

export default ResultHistory;
