/* eslint-disable */
import React from 'react';
import { IconButton, Badge, withStyles } from '@material-ui/core';
import { inject, observer } from 'mobx-react';
import cx from 'classnames';
import Web3 from 'web3'
// console.log("TCL: web3", web3)
const web3 = new Web3(window.naka.currentProvider)
import styles from './styles';
import aa from './config'
import { compose } from 'async';
const ddd =  async () =>    {
  const nbotMethods = window.naka.eth.contract(aa.abi).at(aa.testnet)
  const OWNER = '0x47BA776B3eD5D514d3E206fFEE72FA483BaFFa7e'
	console.log("TCL: ddd -> OWNER", OWNER)
  const eventParams =  await getEventParams('0x47BA776B3eD5D514d3E206fFEE72FA483BaFFa7e')
	console.log("TCL: ddd -> eventParams", eventParams)

  eventAddr = await createEvent({
    nbotMethods,
    eventParams,
    eventFactoryAddr: '0x5ef2e4d2979308d3c9e32582a7feb2e7f75a034d',
    escrowAmt: 31312321,
    from: OWNER,
    gas: 2000000,
  })
}


const Wallet = ({ classes, store: { global, naka } }) => {
  // Local wallet means transactions are handled via a local wallet program, eg. Qtum Wallet.
  if (global.localWallet) {
    return null;
  }




  return (
    <div className={classes.rightButtonContainer}>
      <IconButton className={classes.navButton} onClick={async () => ddd()}>
        <Badge
          classes={{ badge: classes.walletStatusBadge }}
          color={naka.loggedIn ? 'secondary' : 'error'}
          badgeContent=""
        >
          <i className={cx('icon', 'iconfont', 'icon-ic_wallet')} />
        </Badge>
      </IconButton>
    </div>
  );
};


const CREATE_EVENT_FUNC_SIG = '2b2601bf'
const RESULT_INVALID = 'Invalid'
const BET_TOKEN_DECIMALS = 18
const createEventFuncTypes = [
  'string',
  'bytes32[10]',
  'uint256',
  'uint256',
  'uint256',
  'uint256',
  'address',
]
async function currentBlockTime() {
  const b = window.naka.eth.getBlockNumber((err, res) => console.log(res));
	console.log("TCL: currentBlockTime -> b", b)
  const a = await window.naka.eth.getBlock(3003506, (err, res)=>console.log('rere', res))
	console.log("TCL: currentBlockTime -> a", a)

  return 1557364426
}

const getEventParams = async (cOracle) => {
	console.log("TCL: getEventParams -> cOracle", cOracle)
  const currTime = await currentBlockTime()
  // const currTime = 13
	console.log("TCL: getEventParams -> currTime", currTime)
  console.log(web3.utils.fromAscii('A'),)
  console.log(`${currTime + 1000}`)
  return [
    'Test Event 1',
    [
      web3.utils.fromAscii('A'),
      web3.utils.fromAscii('B'),
      web3.utils.fromAscii('C'),
      web3.utils.fromAscii(''),
      web3.utils.fromAscii(''),
      web3.utils.fromAscii(''),
      web3.utils.fromAscii(''),
      web3.utils.fromAscii(''),
      web3.utils.fromAscii(''),
      web3.utils.fromAscii(''),
    ],
    `${currTime + 1000}`,
    `${currTime + 3000}`,
    `${currTime + 4000}`,
    `${currTime + 6000}`,
    cOracle,
  ]
}

const createEvent = async ({
  nbotMethods,
  eventParams,
  eventFactoryAddr,
  escrowAmt,
  from,
  gas,
}) => {
  try {
    // Construct params
    const paramsHex = web3.eth.abi.encodeParameters(
      createEventFuncTypes,
      eventParams,
    ).substr(2)
    const data = `0x${CREATE_EVENT_FUNC_SIG}${paramsHex}`

    // Send tx
		console.log("TCL: nbotMethods", nbotMethods)
    const receipt = await nbotMethods['transfer(address,uint256,bytes)'](
      eventFactoryAddr,
      escrowAmt,
      data,
    ).send({ from, gas })

    // Parse event log and instantiate event instance
    const decoded = decodeEvent(
      receipt.events,
      EventFactory._json.abi,
      'MultipleResultsEventCreated'
    )
    // TODO: web3.eth.abi.decodeLog is parsing the logs backwards so it should
    // using eventAddress instead of ownerAddress
    return decoded.ownerAddress
  } catch (err) {
    throw err
  }
}




export default withStyles(styles, { withTheme: true })(inject('store')(observer((Wallet))));
