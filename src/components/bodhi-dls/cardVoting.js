import React, { Component, PropTypes } from 'react';
import { Button, InputNumber } from 'antd';
import { connect } from 'react-redux';

import topicActions from '../../redux/topic/actions';

class CardVoting extends Component {
  constructor(props) {
    super(props);

    this.state = {
      voteAmount: 0,
    };

    this.onParticipateClick = this.onParticipateClick.bind(this);
    this.onConfirm = this.onConfirm.bind(this);
    this.onInputNumberChange = this.onInputNumberChange.bind(this);
  }

  onParticipateClick(evt) {
    this.props.onEditingToggled();
  }

  onConfirm(evt) {
    console.log(`onConfirm: amount ${this.state.voteAmount}`);
    this.props.onSubmit({ amount: this.state.voteAmount });
  }

  onInputNumberChange(value) {
    this.setState({
      voteAmount: value,
    });
  }

  render() {
    const {
      amount, token, children, editingToggled,
    } = this.props;

    const titleLineHeight = 36;
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
          {editingToggled ?
            (
              <div>
                <div className="input-number-container">
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
                </div>
                <Button
                  type="primary"
                  onClick={this.onConfirm}
                  size="large"
                  disabled={!this.state.voteAmount}
                >
                Confirm
                </Button>
              </div>
            )
            :
            (<Button
              type="primary"
              onClick={this.onParticipateClick}
              size="large"
            >
              {token === 'BOT' ? 'Vote' : 'Participate'}
            </Button>)
          }

        </div>
      </div>
    );
  }
}

CardVoting.propTypes = {
  amount: PropTypes.number,
  token: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
  ]),
  editingToggled: PropTypes.bool,
  onEditingToggled: PropTypes.func,
  onSubmit: PropTypes.func,
};

CardVoting.defaultProps = {
  amount: 0,
  token: 'QTUM',
  children: [],
  editingToggled: false,
  onEditingToggled: undefined,
  onSubmit: undefined,
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
