import React, { Component, PropTypes } from 'react';
import { Button, Alert } from 'antd';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

class CardFinished extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };

    this.onWithdrawBtnClicked = this.onWithdrawBtnClicked.bind(this);
  }

  componentWillMount() {
  }

  onWithdrawBtnClicked() {
    // Withdraw action

    this.props.onWithdraw();
  }

  render() {
    const {
      amount,
      children,
      result,
    } = this.props;

    // Build Alert elements based on result
    let alertElement;

    if (result) {
      if (result.txid) {
        alertElement = (<Alert
          message="Success!"
          description={`Transaction sent! Waiting for confirmations.\nhttps://testnet.qtum.org/tx/${result.txid}`}
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
    } else {
      confirmBtnDisabled = false;
    }

    return (
      <div className="cardVoting">
        <div className="header">
          <p style={{ marginBottom: '24px' }}><FormattedMessage id="str.RAISE" defaultMessage="RAISED" />:</p>
          <h3><span>{amount.toFixed(2)}</span>
            <span>QTUM</span></h3>
        </div>
        <div className="body">
          <p style={{ marginBottom: '24px' }}><FormattedMessage id="str.outcome" defaultMessage="OUTCOMES" /></p>
          {children}
        </div>
        <div className="action">

          {alertContainerEle}
          <Button
            type="primary"
            onClick={this.onWithdrawBtnClicked}
            size="large"
            disabled={confirmBtnDisabled}
          >
            <FormattedMessage id="cardinfo.withdraw" defaultMessage="Withdraw" />
          </Button>

        </div>
      </div>
    );
  }
}

CardFinished.propTypes = {
  amount: PropTypes.number,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
  ]),
  onWithdraw: PropTypes.func.isRequired,
  result: PropTypes.object,
};

CardFinished.defaultProps = {
  amount: 0,
  children: [],
  result: undefined,
};

export default connect(null, null)(CardFinished);
