export default Object.freeze({
  address: '0x1111111111111111111111111111111111111111',
  abi: [{ anonymous: false, inputs: [{ indexed: true, name: 'token', type: 'address' }, { indexed: true, name: 'exchanger', type: 'address' }, { indexed: false, name: 'newRate', type: 'uint256' }], name: 'RateChanged', type: 'event' }, { constant: true, inputs: [{ name: 'token', type: 'address' }, { name: 'exchanger', type: 'address' }], name: 'getRate', outputs: [{ name: 'rate', type: 'uint256' }], payable: false, stateMutability: 'view', type: 'function' }, { constant: false, inputs: [{ name: 'token', type: 'address' }, { name: 'newRate', type: 'uint256' }], name: 'setRate', outputs: [{ name: 'success', type: 'bool' }], payable: false, stateMutability: 'nonpayable', type: 'function' }],
});
