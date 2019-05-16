import { observable, action, computed } from 'mobx';
import { isEmpty, find, findIndex } from 'lodash';
import { WalletAddress } from 'models';
import promisify from 'js-promisify';

import { satoshiToDecimal, weiToDecimal } from '../helpers/utility';
import getContracts from '../config/contracts';

const INIT_VALUE = {
  addresses: [],
  currentWalletAddress: undefined,
};

export default class WalletStore {
  @observable addresses = INIT_VALUE.addresses;
  @observable currentWalletAddress = INIT_VALUE.currentWalletAddress;

  @computed get currentAddress() {
    return this.currentWalletAddress ? this.currentWalletAddress.address : '';
  }

  @computed get lastAddressWithdrawLimit() {
    return {
      NAKA: this.currentWalletAddress ? this.currentWalletAddress.naka : 0,
      NBOT: this.currentWalletAddress ? this.currentWalletAddress.nbot : 0,
    };
  }

  constructor(app) {
    this.app = app;
  }

  /**
   * Finds and sets the current wallet address based on the address.
   * @param {string} address Address to find in the list of wallet addresses.
   */
  setCurrentWalletAddress = (address) => {
    this.currentWalletAddress = find(this.addresses, { address });
  }

  /**
   * Sets the account sent from Naka Wallet.
   * @param {object} account Account object.
   */
  @action
  onNakaAccountChange = async (account) => {
    const { loggedIn, network, address, balance } = account;

    // Reset addresses if logged out
    if (!loggedIn) {
      this.addresses.clear();
      this.currentWalletAddress = INIT_VALUE.currentWalletAddress;
      return;
    }

    // Stop login if the chain network does not match
    if (network.toLowerCase() !== process.env.NETWORK) {
      this.app.naka.openPopover('naka.loggedIntoWrongNetwork');
      return;
    }

    // If setting Naka Wallet's account for the first time or the address changes, fetch the NBOT balance right away.
    // After the initial NBOT balance fetch, it will refetch on every new block.
    const fetchInitNbotBalance = isEmpty(this.addresses);

    const index = findIndex(this.addresses, { address });
    if (index === -1) {
      // Push the WalletAddress if it is not in the list of addresses
      const walletAddress = new WalletAddress({ address, naka: balance, nbot: 0 }, false);
      this.addresses.push(walletAddress);
      this.currentWalletAddress = walletAddress;
    } else {
      // Update existing balances
      const walletAddress = this.addresses[index];
      walletAddress.naka = weiToDecimal(balance);
      if (this.currentWalletAddress.address === address) {
        this.currentWalletAddress.naka = weiToDecimal(balance);
      }
    }

    if (fetchInitNbotBalance) {
      this.fetchNbotBalance(address);
    }
  }

  /**
   * Calls the BodhiToken contract to get the NBOT balance and sets the balance in the addresses.
   * @param {string} address Address to check the NBOT balance of.
   */
  fetchNbotBalance = async (address) => {
    if (isEmpty(address)) {
      return;
    }

    try {
      const nbotMethods = window.naka.eth.contract(getContracts().NakaBodhiToken.abi).at(getContracts().NakaBodhiToken.address);
      const balance = await promisify(nbotMethods.balanceOf, [address]);
      const nbot = satoshiToDecimal(balance.toString(16));

      // Update WalletAddress NBOT in list of addresses
      const index = findIndex(this.addresses, { address });
      if (index !== -1) {
        this.addresses[index].nbot = nbot;
      }

      // Update current WalletAddress NBOT if matching address
      if (this.currentWalletAddress && this.currentWalletAddress.address === address) {
        this.currentWalletAddress.nbot = nbot;
      }
    } catch (err) {
      console.error(`Error getting NBOT balance for ${address}: ${err.message}`); // eslint-disable-line
    }
  }
}
