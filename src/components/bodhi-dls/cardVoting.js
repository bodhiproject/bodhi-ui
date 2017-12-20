import React, { Component, PropTypes } from 'react';
import { Button, InputNumber, Alert } from 'antd';
import { connect } from 'react-redux';

import topicActions from '../../redux/topic/actions';

class CardVoting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      voteAmount: 0,
    };

    this.onBottomBtnClicked = this.onBottomBtnClicked.bind(this);
    this.onConfirmBtnClicked = this.onConfirmBtnClicked.bind(this);
    this.onInputNumberChange = this.onInputNumberChange.bind(this);
  }

  componentWillMount() {
  }

  onBottomBtnClicked() {
    this.props.onEditingToggled();
  }

  onConfirmBtnClicked() {
    this.props.onSubmit({ amount: this.state.voteAmount });
  }

  onInputNumberChange(value) {
    this.setState({
      voteAmount: value,
    });
  }

  getConfirmViews() {
    const {
      amount, config, token, result, radioIndex, checkingAllowance,
    } = this.props;
    const amountStr = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const showAmountInput = config && config.showAmountInput;

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

    // Construct alert
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
    const alertContainerEle = <div className="alert-container">{alertElement}</div>;

    // Determine Confirm button disabled status
    let buttonText = 'Confirm';
    let confirmBtnDisabled = true;
    if (checkingAllowance) {
      confirmBtnDisabled = true;
      buttonText = 'Approving BOT transfer... please wait';
    } else if (result && result.result) {
      // Disable the button if request went through
      confirmBtnDisabled = true;
      buttonText = 'Transaction posted';
    } else if (showAmountInput) {
      // Both amount input and radio box has to be set for disabled to be false
      confirmBtnDisabled = !this.state.voteAmount || !radioIndex;
    } else {
      // If radio box is set, set disabled to false
      confirmBtnDisabled = !radioIndex;
    }

    // Construct entire view
    const confirmViews = (
      <div>
        {amountInputEle}
        {alertContainerEle}

        <Button
          type="primary"
          onClick={this.onConfirmBtnClicked}
          size="large"
          disabled={confirmBtnDisabled}
        >
          {buttonText}
        </Button>
      </div>
    );

    return confirmViews;
  }

  getBottomButtonViews() {
    const { config } = this.props;
    const bottomBtnText = config && config.bottomBtnText;
    const bottomButtonViews = (
      <Button
        type="primary"
        onClick={this.onBottomBtnClicked}
        size="large"
      >
        {bottomBtnText}
      </Button>
    );
    return bottomButtonViews;
  }

  render() {
    const {
      amount, token, children, editingToggled,
    } = this.props;
    const amountStr = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return (
      <div className="cardVoting">
        <div className="header">
          <p style={{ marginBottom: '24px' }}>RAISED:</p>
          <h3><span>{amountStr}</span>
            <span>{token}</span></h3>
        </div>
        <div className="body">
          <p style={{ marginBottom: '24px' }}>OUTCOMES</p>
          {children}
        </div>
        <div className="action">
          {editingToggled ? (this.getConfirmViews()) : (this.getBottomButtonViews())}
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
  checkingAllowance: PropTypes.bool,
};

CardVoting.defaultProps = {
  amount: 0,
  config: undefined,
  children: [],
  editingToggled: false,
  onEditingToggled: undefined,
  result: undefined,
  radioIndex: 0,
  checkingAllowance: false,
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
