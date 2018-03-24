import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'lodash';
import moment from 'moment';
import Grid from 'material-ui/Grid';
import { Field } from 'redux-form';
import { FormControl, FormHelperText } from 'material-ui/Form';
import { MenuItem } from 'material-ui/Menu';
import Select from 'material-ui/Select';
import { FormattedMessage, injectIntl, intlShape, defineMessages } from 'react-intl';

import appActions from '../../../../redux/App/actions';

const messages = defineMessages({
  notEnoughBot: {
    id: 'str.notEnoughBot',
    defaultMessage: 'You don\'t have enough BOT',
  },
});

class CreateEventCreatorPicker extends React.PureComponent {
  static propTypes = {
    name: PropTypes.string.isRequired,
    walletAddresses: PropTypes.array.isRequired,
    lastUsedAddress: PropTypes.string.isRequired,
    setLastUsedAddress: PropTypes.func.isRequired,
    changeFormFieldValue: PropTypes.func.isRequired,
    eventEscrowAmount: PropTypes.number.isRequired,
    intl: intlShape.isRequired, // eslint-disable-line react/no-typos
  };

  renderCreatorAddressSelector = ({
    input,
    meta: { touched, error },
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
        {this.props.walletAddresses.map((item, index) => (
          <MenuItem key={item.address} value={item.address}>
            {`${item.address}`}
            {` (${item.qtum ? item.qtum.toFixed(2) : 0} QTUM, ${item.bot ? item.bot.toFixed(2) : 0} BOT)`}
          </MenuItem>
        ))}
      </Select>
      {
        error ?
          <FormHelperText error>{error}</FormHelperText> : null
      }
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

  onCreatorAddressChange = (event, newValue, previousValue, name) => {
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

const mapStateToProps = (state) => ({
  walletAddresses: state.App.get('walletAddresses'),
  lastUsedAddress: state.App.get('lastUsedAddress'),
});

function mapDispatchToProps(dispatch) {
  return {
    setLastUsedAddress: (address) => dispatch(appActions.setLastUsedAddress(address)),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(CreateEventCreatorPicker));
