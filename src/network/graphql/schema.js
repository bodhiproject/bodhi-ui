export const NEXT_TRANSACTION_SKIPS = `
  nextEventSkip
  nextBetSkip
  nextResultSetSkip
  nextWithdrawSkip
`;

export const PAGE_INFO = `
  hasNextPage
  pageNumber
  count
  nextTransactionSkips { ${NEXT_TRANSACTION_SKIPS} }
`;

export const BLOCK = `
  blockNum
  blockTime
`;

export const TRANSACTION_RECEIPT = `
  status
  blockHash
  blockNumber
  transactionHash
  from
  to
  contractAddress
  cumulativeGasUsed
  gasUsed
  gasPrice
`;

export const PENDING_TRANSACTIONS = `
  bet
  resultSet
  withdraw
  total
`;

export const ROUND_BETS = `
  singleUserRoundBets
  singleTotalRoundBets
`;

// Transaction interface
export const ITRANSACTION = `
  txType
  txid
  txStatus
  txReceipt { ${TRANSACTION_RECEIPT} }
  blockNum
  block { ${BLOCK} }
`;

// MultipleResultsEvent extends Transaction
export const MULTIPLE_RESULTS_EVENT = `
  ${ITRANSACTION}
  address
  ownerAddress
  version
  name
  results
  numOfResults
  centralizedOracle
  betStartTime
  betEndTime
  resultSetStartTime
  resultSetEndTime
  escrowAmount
  arbitrationLength
  thresholdPercentIncrease
  arbitrationRewardPercentage
  currentRound
  currentResultIndex
  consensusThreshold
  previousConsensusThreshold
  arbitrationEndTime
  status
  language
  pendingTxs { ${PENDING_TRANSACTIONS} }
  roundBets { ${ROUND_BETS} }
  totalBets
  withdrawnList
`;

export const PAGINATED_EVENTS = `
  totalCount
  pageInfo { ${PAGE_INFO} }
  items { ${MULTIPLE_RESULTS_EVENT} }
`;

// Bet extends Transaction
export const BET = `
  ${ITRANSACTION}
  eventAddress
  betterAddress
  resultIndex
  amount
  eventRound
  resultName
  eventName
`;

export const PAGINATED_BETS = `
  totalCount
  pageInfo { ${PAGE_INFO} }
  items { ${BET} }
`;

// ResultSet extends Transaction
export const RESULT_SET = `
  ${ITRANSACTION}
  eventAddress
  centralizedOracleAddress
  resultIndex
  amount
  eventRound
  resultName
  eventName
`;

export const PAGINATED_RESULT_SETS = `
  totalCount
  pageInfo { ${PAGE_INFO} }
  items { ${RESULT_SET} }
`;

// Withdraw extends Transaction
export const WITHDRAW = `
  ${ITRANSACTION}
  eventAddress
  winnerAddress
  winningAmount
  escrowWithdrawAmount
  eventName
`;

export const PAGINATED_WITHDRAWS = `
  totalCount
  pageInfo { ${PAGE_INFO} }
  items { ${WITHDRAW} }
`;

export const PAGINATED_TRANSACTIONS = `
  totalCount
  pageInfo { ${PAGE_INFO} }
  items {
    ${ITRANSACTION}
    ... on MultipleResultsEvent {
      address
      ownerAddress
      ownerName
      name
      escrowAmount
    }
    ... on Bet {
      eventAddress
      betterAddress
      betterName
      resultIndex
      amount
      eventRound
      resultName
      eventName
    }
    ... on ResultSet {
      eventAddress
      centralizedOracleAddress
      centralizedOracleName
      resultIndex
      amount
      eventRound
      resultName
      eventName
    }
    ... on Withdraw {
      eventAddress
      winnerAddress
      winnerName
      winningAmount
      escrowWithdrawAmount
      eventName
    }
  }
`;

export const SYNC_INFO = `
  syncBlockNum
  syncBlockTime
  syncPercent
`;

export const TOTAL_RESULT_BETS = `
  totalBets
  betterBets
  totalVotes
  betterVotes
`;

export const ALL_STATS = `
  eventCount
  participantCount
  totalBets
`;

export const LEADERBOARD_ENTRY = `
  eventAddress
  userAddress
  investments
  winnings
  returnRatio
`;

export const PAGINATED_LEADERBOARD_ENTRY = `
  totalCount
  pageInfo { ${PAGE_INFO} }
  items { ${LEADERBOARD_ENTRY} }
`;
