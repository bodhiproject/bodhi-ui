import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Field } from 'redux-form';
import { MenuItem, FormControl, FormHelperText, Select } from '@material-ui/core';
import { injectIntl, intlShape, defineMessages } from 'react-intl';

import appActions from '../../../../redux/App/actions';

const messages = defineMessages({
  notEnoughBot: {
    id: 'str.notEnoughBot',
    defaultMessage: 'You don\'t have enough BOT',
  },
});


@injectIntl
@connect((state) => ({
  walletAddresses: state.App.get('walletAddresses'),
  lastUsedAddress: state.App.get('lastUsedAddress'),
}), (dispatch) => ({
  setLastUsedAddress: (address) => dispatch(appActions.setLastUsedAddress(address)),
}))
export default class CreateEventCreatorPicker extends Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    walletAddresses: PropTypes.array.isRequired,
    lastUsedAddress: PropTypes.string.isRequired,
    setLastUsedAddress: PropTypes.func.isRequired,
    changeFormFieldValue: PropTypes.func.isRequired,
    eventEscrowAmount: PropTypes.number,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  };

  static defaultProps = {
    eventEscrowAmount: undefined,
  }

  renderCreatorAddressSelector = ({
    input,
    meta: { error },
    ...custom
  }) => {
    const { name } = this.props;

    if (_.isEmpty(input.value)) {
      this.props.changeFormFieldValue(name, this.props.lastUsedAddress);
    }

    return (<FormControl fullWidth>
      <Select
        {...input}
        {...custom}
        fullWidth
        error={Boolean(error)}
      >
        {this.props.walletAddresses.map((item) => (
          <MenuItem key={item.address} value={item.address}>
            {`${item.address}`}
            {` (${item.qtum ? item.qtum.toFixed(2) : 0} QTUM, ${item.bot ? item.bot.toFixed(2) : 0} BOT)`}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText error>{error}</FormHelperText>}
    </FormControl>);
  };

  validateEnoughBOT = (address) => {
    const { walletAddresses, eventEscrowAmount, intl } = this.props;

    const checkingAddresses = _.filter(walletAddresses, { address });
    if (checkingAddresses.length && checkingAddresses[0].bot < eventEscrowAmount) {
      return intl.formatMessage(messages.notEnoughBot);
    }

    return null;
  };

  onCreatorAddressChange = (event, newValue) => {
    this.props.setLastUsedAddress(newValue);
  };

  render() {
    const { name } = this.props;

    return (
      <Field
        fullWidth
        name={name}
        validate={[this.validateEnoughBOT]}
        onChange={this.onCreatorAddressChange}
        component={this.renderCreatorAddressSelector}
      />
    );
  }
}
