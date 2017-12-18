import React, { Component, PropTypes } from 'react';
import { Button, Alert } from 'antd';
import { connect } from 'react-redux';

import topicActions from '../../redux/topic/actions';

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

    this.props.onSubmit();
  }

  render() {
    const {
      amount, config, children, result,
    } = this.props;

    const amountStr = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Build Alert elements based on result
    let alertElement;

    if (result) {
      if (result.result) {
        alertElement =
            (<Alert
              message="Success!"
              description={`The transaction is broadcasted to blockchain. You can view details from below link https://testnet.qtum.org/tx/${result.result.txid}.`}
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
          <p style={{ marginBottom: '24px' }}>RAISED:</p>
          <h3><span>{amountStr}</span>
            <span>QTUM</span></h3>
        </div>
        <div className="body">
          <p style={{ marginBottom: '24px' }}>OUTCOMES</p>
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
              Withdraw
          </Button>


        </div>
      </div>
    );
  }
}

CardFinished.propTypes = {
  amount: PropTypes.number,
  config: PropTypes.object,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
  ]),
  onSubmit: PropTypes.func,
  result: PropTypes.object,
};

CardFinished.defaultProps = {
  amount: 0,
  config: undefined,
  children: [],
  onSubmit: undefined,
  result: undefined,
};

const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: () => dispatch(topicActions.onSubmit()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CardFinished);
