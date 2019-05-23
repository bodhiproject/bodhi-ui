const { sortBy, map } = require('lodash');

/* eslint-disable */
const contracts = {
  1: {
    EventFactory: {
      mainnet: '',
      testnet: '0x4116704445877d54188d11104b1843bb9089ccf5',
      abi: [{"inputs": [{"name": "configManager","type": "address"}],"payable": false,"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"name": "eventAddress","type": "address"},{"indexed": true,"name": "ownerAddress","type": "address"}],"name": "MultipleResultsEventCreated","type": "event"},{"constant": false,"inputs": [{"name": "from","type": "address"},{"name": "value","type": "uint256"},{"name": "data","type": "bytes"}],"name": "tokenFallback","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [],"name": "withdrawEscrow","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "didWithdraw","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "view","type": "function"}],
    },
    MultipleResultsEvent: {
      abi: [{"constant": true,"inputs": [],"name": "owner","outputs": [{"name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "_newOwner","type": "address"}],"name": "transferOwnership","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"inputs": [{"name": "owner","type": "address"},{"name": "eventName","type": "string"},{"name": "eventResults","type": "bytes32[11]"},{"name": "numOfResults","type": "uint8"},{"name": "betStartTime","type": "uint256"},{"name": "betEndTime","type": "uint256"},{"name": "resultSetStartTime","type": "uint256"},{"name": "resultSetEndTime","type": "uint256"},{"name": "centralizedOracle","type": "address"},{"name": "configManager","type": "address"}],"payable": false,"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"name": "eventAddress","type": "address"},{"indexed": true,"name": "better","type": "address"},{"indexed": false,"name": "resultIndex","type": "uint8"},{"indexed": false,"name": "amount","type": "uint256"},{"indexed": false,"name": "eventRound","type": "uint8"}],"name": "BetPlaced","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "eventAddress","type": "address"},{"indexed": true,"name": "centralizedOracle","type": "address"},{"indexed": false,"name": "resultIndex","type": "uint8"},{"indexed": false,"name": "amount","type": "uint256"},{"indexed": false,"name": "eventRound","type": "uint8"},{"indexed": false,"name": "nextConsensusThreshold","type": "uint256"},{"indexed": false,"name": "nextArbitrationEndTime","type": "uint256"}],"name": "ResultSet","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "eventAddress","type": "address"},{"indexed": true,"name": "voter","type": "address"},{"indexed": false,"name": "resultIndex","type": "uint8"},{"indexed": false,"name": "amount","type": "uint256"},{"indexed": false,"name": "eventRound","type": "uint8"}],"name": "VotePlaced","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "eventAddress","type": "address"},{"indexed": true,"name": "voter","type": "address"},{"indexed": false,"name": "resultIndex","type": "uint8"},{"indexed": false,"name": "amount","type": "uint256"},{"indexed": false,"name": "eventRound","type": "uint8"},{"indexed": false,"name": "nextConsensusThreshold","type": "uint256"},{"indexed": false,"name": "nextArbitrationEndTime","type": "uint256"}],"name": "VoteResultSet","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "eventAddress","type": "address"},{"indexed": true,"name": "winner","type": "address"},{"indexed": false,"name": "winningAmount","type": "uint256"},{"indexed": false,"name": "escrowAmount","type": "uint256"}],"name": "WinningsWithdrawn","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "_previousOwner","type": "address"},{"indexed": true,"name": "_newOwner","type": "address"}],"name": "OwnershipTransferred","type": "event"},{"constant": false,"inputs": [{"name": "from","type": "address"},{"name": "value","type": "uint256"},{"name": "data","type": "bytes"}],"name": "tokenFallback","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [],"name": "withdraw","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [{"name": "better","type": "address"}],"name": "calculateWinnings","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "version","outputs": [{"name": "","type": "uint16"}],"payable": false,"stateMutability": "pure","type": "function"},{"constant": true,"inputs": [],"name": "currentRound","outputs": [{"name": "","type": "uint8"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "currentResultIndex","outputs": [{"name": "","type": "uint8"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "currentConsensusThreshold","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "currentArbitrationEndTime","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "eventMetadata","outputs": [{"name": "","type": "uint16"},{"name": "","type": "string"},{"name": "","type": "bytes32[11]"},{"name": "","type": "uint8"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "centralizedMetadata","outputs": [{"name": "","type": "address"},{"name": "","type": "uint256"},{"name": "","type": "uint256"},{"name": "","type": "uint256"},{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "configMetadata","outputs": [{"name": "","type": "uint256"},{"name": "","type": "uint256"},{"name": "","type": "uint256"},{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "totalBets","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "withdrawer","type": "address"}],"name": "didWithdraw","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "didWithdrawEscrow","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "view","type": "function"}],
    },
  },
  0: {
    TokenExchange: {
      mainnet: '0x1111111111111111111111111111111111111111',
      testnet: '0x1111111111111111111111111111111111111111',
      abi: [{ anonymous: false, inputs: [{ indexed: true, name: 'token', type: 'address' }, { indexed: true, name: 'exchanger', type: 'address' }, { indexed: false, name: 'newRate', type: 'uint256' }], name: 'RateChanged', type: 'event' }, { constant: true, inputs: [{ name: 'token', type: 'address' }, { name: 'exchanger', type: 'address' }], name: 'getRate', outputs: [{ name: 'rate', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: 'token', type: 'address' }, { name: 'newRate', type: 'uint256' }], name: 'setRate', outputs: [{ name: 'success', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function' }],
    },
    NakaBodhiToken: {
      mainnet: '0x1a4f4787d4e2382c3d2259ccdf587cc11b3ba7d9',
      testnet: '0x809388c8770c578cb87df1d1e84e3436d8156fda',
      abi: [{ constant: true, inputs: [], name: 'name', outputs: [{ name: 'tokenName', type: 'string' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: 'spender', type: 'address' }, { name: 'amount', type: 'uint256' }], name: 'approve', outputs: [{ name: 'success', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'totalSupply', outputs: [{ name: 'supply', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: 'from', type: 'address' }, { name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], name: 'transferFrom', outputs: [{ name: 'success', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'decimals', outputs: [{ name: 'tokenDecimals', type: 'uint8' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [{ name: 'owner', type: 'address' }], name: 'balanceOf', outputs: [{ name: 'balance', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [], name: 'renounceOwnership', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [], name: 'owner', outputs: [{ name: '', type: 'address' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'isOwner', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: true, inputs: [], name: 'symbol', outputs: [{ name: 'tokenSymbol', type: 'string' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], name: 'transfer', outputs: [{ name: 'success', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: false, inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }, { name: 'data', type: 'bytes' }], name: 'transfer', outputs: [{ name: 'success', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function' }, { constant: true, inputs: [{ name: 'owner', type: 'address' }, { name: 'spender', type: 'address' }], name: 'allowance', outputs: [{ name: 'remaining', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: 'newOwner', type: 'address' }], name: 'transferOwnership', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' }, { inputs: [{ name: 'name', type: 'string' }, { name: 'symbol', type: 'string' }, { name: 'decimals', type: 'uint8' }, { name: 'totalSupply', type: 'uint256' }, { name: 'owner', type: 'address' }], payable: false, stateMutability: 'nonpayable', type: 'constructor' }, { anonymous: false, inputs: [{ indexed: true, name: 'previousOwner', type: 'address' }, { indexed: true, name: 'newOwner', type: 'address' }], name: 'OwnershipTransferred', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'from', type: 'address' }, { indexed: true, name: 'to', type: 'address' }, { indexed: false, name: 'amount', type: 'uint256' }], name: 'Transfer', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'from', type: 'address' }, { indexed: true, name: 'to', type: 'address' }, { indexed: false, name: 'amount', type: 'uint256' }, { indexed: false, name: 'data', type: 'bytes' }], name: 'Transfer', type: 'event' }, { anonymous: false, inputs: [{ indexed: true, name: 'owner', type: 'address' }, { indexed: true, name: 'spender', type: 'address' }, { indexed: false, name: 'amount', type: 'uint256' }], name: 'Approval', type: 'event' }],
    },
    ConfigManager: {
      mainnet: '',
      testnet: '0x4739f0edf7fe6094bb799bfcfa97b377686d1c00',
      abi: [{"constant": true,"inputs": [],"name": "owner","outputs": [{"name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "_newOwner","type": "address"}],"name": "transferOwnership","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"inputs": [],"payable": false,"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"name": "oldAddress","type": "address"},{"indexed": true,"name": "newAddress","type": "address"}],"name": "BodhiTokenChanged","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "oldAddress","type": "address"},{"indexed": true,"name": "newAddress","type": "address"}],"name": "EventFactoryChanged","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "contractAddress","type": "address"}],"name": "ContractWhitelisted","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "_previousOwner","type": "address"},{"indexed": true,"name": "_newOwner","type": "address"}],"name": "OwnershipTransferred","type": "event"},{"constant": false,"inputs": [{"name": "contractAddress","type": "address"}],"name": "addToWhitelist","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "contractAddress","type": "address"}],"name": "setBodhiToken","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "contractAddress","type": "address"}],"name": "setEventFactory","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "newAmount","type": "uint256"}],"name": "setEventEscrowAmount","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "newLength","type": "uint256"}],"name": "setArbitrationLength","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "newPercentage","type": "uint8"}],"name": "setArbitrationRewardPercentage","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "newThreshold","type": "uint256"}],"name": "setStartingOracleThreshold","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "newPercentage","type": "uint256"}],"name": "setConsensusThresholdPercentIncrease","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "bodhiTokenAddress","outputs": [{"name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "eventFactoryAddress","outputs": [{"name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "eventEscrowAmount","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "arbitrationLength","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "arbitrationRewardPercentage","outputs": [{"name": "","type": "uint8"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "startingOracleThreshold","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "thresholdPercentIncrease","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "contractAddress","type": "address"}],"name": "isWhitelisted","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "view","type": "function"}],
    },
    EventFactory: {
      mainnet: '',
      testnet: '0xf5594dad875cf361b3cf5a2e9662528bb96ea89c',
      abi: [{"inputs": [{"name": "configManager","type": "address"}],"payable": false,"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"name": "eventAddress","type": "address"},{"indexed": true,"name": "ownerAddress","type": "address"}],"name": "MultipleResultsEventCreated","type": "event"},{"constant": false,"inputs": [{"name": "from","type": "address"},{"name": "value","type": "uint256"},{"name": "data","type": "bytes"}],"name": "tokenFallback","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [],"name": "withdrawEscrow","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "didWithdraw","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "view","type": "function"}],
    },
    MultipleResultsEvent: {
      abi: [{"constant": true,"inputs": [],"name": "owner","outputs": [{"name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "_newOwner","type": "address"}],"name": "transferOwnership","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"inputs": [{"name": "owner","type": "address"},{"name": "eventName","type": "string"},{"name": "eventResults","type": "bytes32[11]"},{"name": "numOfResults","type": "uint8"},{"name": "betStartTime","type": "uint256"},{"name": "betEndTime","type": "uint256"},{"name": "resultSetStartTime","type": "uint256"},{"name": "resultSetEndTime","type": "uint256"},{"name": "centralizedOracle","type": "address"},{"name": "configManager","type": "address"}],"payable": false,"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": true,"name": "eventAddress","type": "address"},{"indexed": true,"name": "better","type": "address"},{"indexed": false,"name": "resultIndex","type": "uint8"},{"indexed": false,"name": "amount","type": "uint256"},{"indexed": false,"name": "eventRound","type": "uint8"}],"name": "BetPlaced","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "eventAddress","type": "address"},{"indexed": true,"name": "centralizedOracle","type": "address"},{"indexed": false,"name": "resultIndex","type": "uint8"},{"indexed": false,"name": "amount","type": "uint256"},{"indexed": false,"name": "eventRound","type": "uint8"},{"indexed": false,"name": "nextConsensusThreshold","type": "uint256"},{"indexed": false,"name": "nextArbitrationEndTime","type": "uint256"}],"name": "ResultSet","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "eventAddress","type": "address"},{"indexed": true,"name": "voter","type": "address"},{"indexed": false,"name": "resultIndex","type": "uint8"},{"indexed": false,"name": "amount","type": "uint256"},{"indexed": false,"name": "eventRound","type": "uint8"}],"name": "VotePlaced","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "eventAddress","type": "address"},{"indexed": true,"name": "voter","type": "address"},{"indexed": false,"name": "resultIndex","type": "uint8"},{"indexed": false,"name": "amount","type": "uint256"},{"indexed": false,"name": "eventRound","type": "uint8"},{"indexed": false,"name": "nextConsensusThreshold","type": "uint256"},{"indexed": false,"name": "nextArbitrationEndTime","type": "uint256"}],"name": "VoteResultSet","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "eventAddress","type": "address"},{"indexed": true,"name": "winner","type": "address"},{"indexed": false,"name": "winningAmount","type": "uint256"},{"indexed": false,"name": "escrowAmount","type": "uint256"}],"name": "WinningsWithdrawn","type": "event"},{"anonymous": false,"inputs": [{"indexed": true,"name": "_previousOwner","type": "address"},{"indexed": true,"name": "_newOwner","type": "address"}],"name": "OwnershipTransferred","type": "event"},{"constant": false,"inputs": [{"name": "from","type": "address"},{"name": "value","type": "uint256"},{"name": "data","type": "bytes"}],"name": "tokenFallback","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [],"name": "withdraw","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "calculateWinnings","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "version","outputs": [{"name": "","type": "uint16"}],"payable": false,"stateMutability": "pure","type": "function"},{"constant": true,"inputs": [],"name": "currentRound","outputs": [{"name": "","type": "uint8"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "currentResultIndex","outputs": [{"name": "","type": "uint8"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "currentConsensusThreshold","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "currentArbitrationEndTime","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "eventMetadata","outputs": [{"name": "","type": "uint16"},{"name": "","type": "string"},{"name": "","type": "bytes32[11]"},{"name": "","type": "uint8"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "centralizedMetadata","outputs": [{"name": "","type": "address"},{"name": "","type": "uint256"},{"name": "","type": "uint256"},{"name": "","type": "uint256"},{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "configMetadata","outputs": [{"name": "","type": "uint256"},{"name": "","type": "uint256"},{"name": "","type": "uint256"},{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "totalBets","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "withdrawer","type": "address"}],"name": "didWithdraw","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "didWithdrawEscrow","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "view","type": "function"}],
    },
  },
};
export default contracts;
/* eslint-enable */

export const TokenExchange = () => contracts['0'].TokenExchange;

export const NakaBodhiToken = () => contracts['0'].NakaBodhiToken;

export const EventFactory = () => {
  // Get latest version
  let keys = Object.keys(contracts);
  keys = sortBy(map(keys, key => Number(key)));
  const latestVersion = keys[keys.length - 1];
  return contracts[`${latestVersion}`].EventFactory;
};
