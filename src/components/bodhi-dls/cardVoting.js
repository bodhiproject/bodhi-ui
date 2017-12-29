/* eslint no-lonely-if: 0 */ // Disable "Unexpected if as the only statement in an else block"

import React, { Component, PropTypes } from 'react';
import { Button, InputNumber, Alert } from 'antd';
import { connect } from 'react-redux';

import topicActions from '../../redux/topic/actions';

class CardVoting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      voteAmount: 0,
      btnLoading: false,
      btnText: '',
      btnDisabled: false,
    };

    this.onConfirmBtnClicked = this.onConfirmBtnClicked.bind(this);
    this.onInputNumberChange = this.onInputNumberChange.bind(this);
    this.getBeforeToggleView = this.getBeforeToggleView.bind(this);
    this.getAfterToggleView = this.getAfterToggleView.bind(this);
    this.buildAlertElements = this.buildAlertElements.bind(this);
  }

  componentWillMount() {
    const { config, skipToggle } = this.props;

    let btnText;

    if (skipToggle) {
      btnText = config && config.afterToggle && config.afterToggle.btnText;
    } else {
      btnText = config && config.beforeToggle && config.beforeToggle.btnText;
    }

    this.setState({
      btnText,
    });
  }

  componentWillReceiveProps(nextProps) {
    const {
      editingToggled, isApproving, result, config, skipToggle,
    } = nextProps;

    // Determine button status by config and return
    let btnText;
    let btnDisabled = false;
    let btnLoading = false;

    if (!editingToggled && !skipToggle) {
      // Before toggle state
      btnText = config && config.beforeToggle && config.beforeToggle.btnText;
      btnDisabled = config && config.beforeToggle && config.beforeToggle.btnDisabled;
    } else {
      // After toggle state
      btnText = config && config.beforeToggle && config.afterToggle.btnText;

      // Determine Confirm button disabled status based on request return
      if (isApproving) {
        btnText = 'Approving BOT transfer... please wait';
        btnLoading = true;
        btnDisabled = false;
      } else if (result && result.result) {
        // Disable the button if request went through
        btnText = 'Transaction posted';
        btnLoading = false;
        btnDisabled = true;
      }
    }

    this.setState({
      btnLoading,
      btnText,
      btnDisabled,
    });
  }

  onConfirmBtnClicked() {
    this.props.onSubmit({ amount: this.state.voteAmount });
  }

  onInputNumberChange(value) {
    this.setState({
      voteAmount: value,
    });
  }

  getAfterToggleView() {
    const {
      config, token, radioIndex, skipToggle,
    } = this.props;

    const showAmountInput = config && config.afterToggle && config.afterToggle.showAmountInput;

    // Construct amount input
    const amountInputEle = (showAmountInput ? (
      <div className="input-number-container">
        <p style={{ marginBottom: '24px' }}>AMOUNT:</p>
        <div className="row-second">
          <InputNumber
            size="large"
            defaultValue={0}
            onChange={this.onInputNumberChange}
          />
          <span>{token}</span>
        </div>
      </div>)
      :
      null);

    // Construct alert elements
    const alertContainerEle = this.buildAlertElements();

    let btnDisabled = true;

    // Determine Confirm button disabled status
    if (skipToggle) {
      btnDisabled = false;
      // buttonText = 'Finalize';
    } else if (showAmountInput) {
      // Both amount input and radio box has to be set for disabled to be false
      btnDisabled = !this.state.voteAmount || !radioIndex;
    } else {
      // If radio box is set, set disabled to false
      btnDisabled = !radioIndex;
    }

    btnDisabled = btnDisabled || this.state.btnDisabled; // Combine local check with this.state.btnDisabled

    return (
      <div>
        {amountInputEle}
        {alertContainerEle}

        <Button
          type="primary"
          onClick={this.onConfirmBtnClicked}
          size="large"
          disabled={btnDisabled}
          loading={this.state.btnLoading}
        >
          {this.state.btnText}
        </Button>

      </div>
    );
  }

  getBeforeToggleView() {
    const { config, onEditingToggled } = this.props;
    const btnText = config && config.beforeToggle && config.beforeToggle.btnText;

    return (
      <Button
        type="primary"
        onClick={onEditingToggled}
        size="large"
        disabled={config && config.beforeToggle && config.beforeToggle.btnDisabled}
      >
        {btnText}
      </Button>
    );
  }

  buildAlertElements() {
    const { result } = this.props;

    let alertElement;
    if (result) {
      if (result.result) {
        alertElement =
            (<Alert
              message="Success!"
              description={`The transaction is broadcasted to blockchain. 
                You can view details from below link https://testnet.qtum.org/tx/${result.result.txid}`}
              type="success"
              closable={false}
            />);
      } else if (result.error) {
        alertElement = (<Alert
          message="Oops, something went wrong"
          description={result.error}
          type="error"
          closable={false}
        />);
      }
    }

    return <div className="alert-container">{alertElement}</div>;
  }

  render() {
    const {
      amount, token, children, editingToggled, skipToggle,
    } = this.props;

    return (
      <div className="cardVoting">
        <div className="header">
          <p style={{ marginBottom: '24px' }}>RAISED:</p>
          <h3><span>{amount.toFixed(2)}</span>
            <span>{token}</span></h3>
        </div>
        <div className="body">
          <p style={{ marginBottom: '24px' }}>OUTCOMES</p>
          {children}
        </div>
        <div className="action">
          {(skipToggle || editingToggled) ? (this.getAfterToggleView()) : (this.getBeforeToggleView())}
        </div>
      </div>
    );
  }
}

CardVoting.propTypes = {
  amount: PropTypes.number,
  config: PropTypes.object,
  token: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
  ]),
  editingToggled: PropTypes.bool,
  onEditingToggled: PropTypes.func,
  onSubmit: PropTypes.func.isRequired,
  result: PropTypes.object,
  radioIndex: PropTypes.number,
  isApproving: PropTypes.bool,
  skipToggle: PropTypes.bool,
};

CardVoting.defaultProps = {
  amount: 0,
  config: undefined,
  children: [],
  editingToggled: false,
  onEditingToggled: undefined,
  result: undefined,
  radioIndex: 0,
  isApproving: false,
  skipToggle: false,
};

const mapStateToProps = (state) => ({
  editingToggled: state.Topic.get('toggled'),
});

function mapDispatchToProps(dispatch) {
  return {
    onEditingToggled: () => dispatch(topicActions.editingToggled()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CardVoting);
