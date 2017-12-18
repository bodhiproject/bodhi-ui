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

  render() {
    const {
      amount, config, token, children, editingToggled, result, radioIndex,
    } = this.props;

    const amountStr = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Build AmountInput elements and determine whether to show based on config
    const amountInputEle = (config.showAmountInput ? (<div className="input-number-container">
      <p style={{ marginBottom: '24px' }}>AMOUNT:</p>
      <div className="row-second">
        <InputNumber
          size="large"
          min={1}
          defaultValue={0}
          onChange={this.onInputNumberChange}
        />
        <span>{token}</span>
      </div>
    </div>) : null);

    // Build Alert elements based on result
    let alertElement;

    if (result) {
      if (result.result) {
        alertElement =
            (<Alert
              message="Success!"
              description={`The transaction is broadcasted to blockchain. You can view details from below link https://testnet.qtum.org/tx/${result.result.txid}`}
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
    let confirmBtnDisabled = true;

    if (result && result.result) {
      // Disable the button if request went through
      confirmBtnDisabled = true;
    } else if (config.showAmountInput) {
      // Both amount input and radio box has to be set for disabled to be false
      confirmBtnDisabled = !this.state.voteAmount || !radioIndex;
    } else {
      // If radio box is set, set disabled to false
      confirmBtnDisabled = !radioIndex;
    }

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
          {editingToggled ?
            (
              <div>
                {amountInputEle}
                {alertContainerEle}

                <Button
                  type="primary"
                  onClick={this.onConfirmBtnClicked}
                  size="large"
                  disabled={confirmBtnDisabled}
                >
                  Confirm
                </Button>
              </div>
            )
            :
            (<Button
              type="primary"
              onClick={this.onBottomBtnClicked}
              size="large"
            >
              {config && config.bottomBtnText}

            </Button>)
          }

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
  onSubmit: PropTypes.func,
  result: PropTypes.object,
  radioIndex: PropTypes.number,
};

CardVoting.defaultProps = {
  amount: 0,
  config: undefined,
  children: [],
  editingToggled: false,
  onEditingToggled: undefined,
  onSubmit: undefined,
  result: undefined,
  radioIndex: 0,
};

const mapStateToProps = (state) => ({
  editingToggled: state.Topic.get('toggled'),
});

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: () => dispatch(topicActions.onSubmit()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CardVoting);
