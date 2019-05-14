const PAGE_INFO = `
  hasNextPage
  pageNumber
  count
`;

const BLOCK = `
  number
  time
`;

const TRANSACTION_RECEIPT = `
  status
  blockHash
  blockNumber
  transactionHash
  from
  to
  contractAddress
  cumulativeGasUsed
  gasUsed
`;

const PENDING_TRANSACTIONS = `
  bet
  resultSet
  withdraw
  total
`;

const MULTIPLE_RESULTS_EVENT = `
  txid
  txStatus
  txReceipt { ${TRANSACTION_RECEIPT} }
  blockNum
  block { ${BLOCK} }
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
  arbitrationEndTime
  totalBets
  status
  language
  pendingTxs { ${PENDING_TRANSACTIONS} }
`;

const PAGINATED_EVENTS = `
  totalCount
  pageInfo { ${PAGE_INFO} }
  items { ${MULTIPLE_RESULTS_EVENT} }
`;

const BET = `
  txid
  txStatus
  txReceipt { ${TRANSACTION_RECEIPT} }
  blockNum
  block { ${BLOCK} }
  eventAddress
  betterAddress
  resultIndex
  amount
  eventRound
`;

const PAGINATED_BETS = `
  totalCount
  pageInfo { ${PAGE_INFO} }
  items { ${BET} }
`;

const RESULT_SET = `
  txid
  txStatus
  txReceipt { ${TRANSACTION_RECEIPT} }
  blockNum
  block { ${BLOCK} }
  eventAddress
  centralizedOracleAddress
  resultIndex
  amount
  eventRound
`;

const PAGINATED_RESULT_SETS = `
  totalCount
  pageInfo { ${PAGE_INFO} }
  items { ${RESULT_SET} }
`;

const WITHDRAW = `
  txid
  txStatus
  txReceipt { ${TRANSACTION_RECEIPT} }
  blockNum
  block { ${BLOCK} }
  eventAddress
  winnerAddress
  winningAmount
  escrowAmount
`;

const PAGINATED_WITHDRAWS = `
  totalCount
  pageInfo { ${PAGE_INFO} }
  items { ${WITHDRAW} }
`;

const SYNC_INFO = `
  syncBlockNum
  syncBlockTime
  syncPercent
`;

const ALL_STATS = `
  eventCount
  participantCount
  totalBets
`;

const MOST_BET = `
  eventAddress
  betterAddress
  amount
`;

const PAGINATED_MOST_BETS = `
  totalCount
  pageInfo { ${PAGE_INFO} }
  items { ${MOST_BET} }
`;

const BIGGEST_WINNER = `
  eventAddress
  betterAddress
  amount
`;

export const TYPE_FIELDS = {
  MULTIPLE_RESULTS_EVENT,
  PAGINATED_EVENTS,
  PAGINATED_BETS,
  PAGINATED_RESULT_SETS,
  PAGINATED_WITHDRAWS,
  SYNC_INFO,
  ALL_STATS,
  PAGINATED_MOST_BETS,
  BIGGEST_WINNER,
};
