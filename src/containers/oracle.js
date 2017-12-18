import React, { PropTypes } from 'react';
import { Row, Col, Breadcrumb, Radio } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import _ from 'lodash';

import CardInfo from '../components/bodhi-dls/cardInfo';
import CardVoting from '../components/bodhi-dls/cardVoting';
import ProgressBar from '../components/bodhi-dls/progressBar';
import LayoutContentWrapper from '../components/utility/layoutWrapper';
import IsoWidgetsWrapper from './Widgets/widgets-wrapper';
import dashboardActions from '../redux/dashboard/actions';
import topicActions from '../redux/topic/actions';

const RadioGroup = Radio.Group;
const DEFAULT_RADIO_VALUE = 0;

const OracleType = {
  CENTRALISED: 'CENTRALISED',
  DECENTRALISED: 'DECENTRALISED',
};

const PageConfig =
  [
    {
      name: 'BETTING',
      breadcrumbLabel: 'Betting',
      showAmountInput: true,
      bottomBtnText: 'Participate',
    },
    {
      name: 'SETTING',
      breadcrumbLabel: 'Setting',
      showAmountInput: false,
      bottomBtnText: 'Set Result',
    },
    {
      name: 'VOTING',
      breadcrumbLabel: 'Voting',
      showAmountInput: true,
      bottomBtnText: 'Vote',
    }];


class OraclePage extends React.Component {
  /**
   * Determine OracleType; default DECENTRALISED
   * @param  {object} oracle Oracle object
   * @return {string}        OracleType
   */
  static getOracleType(oracle) {
    switch (oracle.token) {
      case 'QTUM':
        return OracleType.CENTRALISED;
      case 'BOT':
      default:
        return OracleType.DECENTRALISED;
    }
  }

  /**
 * Get Bet or Vote names and balances from oracle
 * @param  {object} oracle Oracle object
 * @return {array}         {name, value, percent}
 */
  static getBetOrVoteArray(oracle) {
    const totalBalance = _.sum(oracle.amounts);

    if (OraclePage.getOracleType(oracle) === OracleType.CENTRALISED) {
      return _.map(oracle.options, (optionName, index) => ({
        name: optionName,
        value: `${oracle.amounts[index]} ${oracle.token}`,
        percent: _.floor((oracle.amounts[index] / totalBalance) * 100),
      }));
    }

    return _.map(oracle.optionIdxs, (optIndex, index) => ({
      name: oracle.options[optIndex],
      value: `${oracle.amounts[index]} ${oracle.token}`,
      percent: _.floor((oracle.amounts[index] / totalBalance) * 100),
    }));
  }

  constructor(props) {
    super(props);

    this.state = {
      address: this.props.match.params.address,
      oracle: undefined,
      radioValue: DEFAULT_RADIO_VALUE, // Selected index of optionsIdx[]
      config: undefined,
    };

    this.onRadioGroupChange = this.onRadioGroupChange.bind(this);
    this.onFinalizeResult = this.onFinalizeResult.bind(this);
    this.onConfirmBtnClicked = this.onConfirmBtnClicked.bind(this);
    this.getCurrentSenderAddress = this.getCurrentSenderAddress.bind(this);
  }

  componentWillMount() {
    this.props.onGetOracles();
  }

  componentWillReceiveProps(nextProps) {
    const { getOraclesSuccess } = nextProps;

    if (!_.isEmpty(getOraclesSuccess)) {
      const oracle = _.find(getOraclesSuccess, { address: this.state.address });

      if (oracle) {
        const { token, status } = oracle;

        let configName;

        /** Determine what style to use in current card * */
        switch (status) {
          case 'VOTING':
            if (token === 'BOT') {
              configName = 'VOTING';
              break;
            }

            configName = 'BETTING';
            break;

          case 'WAITRESULT':
            configName = 'SETTING';
            break;
          default:
            break;
        }

        this.setState({
          oracle,
          config: _.find(PageConfig, { name: configName }),
        });

        console.log('finalizeResultReturn', this.props.finalizeResultReturn);
      }
    }

    // TODO: For any error case we will render an Oracle not found page
  }

  componentWillUnmount() {
    this.props.onClearRequestReturn();
  }

  onRadioGroupChange(evt) {
    this.setState({
      radioValue: evt.target.value,
    });
  }

  /** The right card Confirm Button event handler * */
  onConfirmBtnClicked(obj) {
    const { oracle, radioValue } = this.state;
    const senderAddress = this.getCurrentSenderAddress();
    const selectedIndex = oracle.optionIdxs[radioValue - 1];
    const { amount } = obj;

    // This should be the address of this oracle
    const contractAddress = '9697b1f2701ca9434132723ee790d1cb0ab0e414';

    if (this.state.config.name === 'BETTING') {
      console.log(`contractAddress is ${contractAddress}, selectedIndex is ${selectedIndex}, amount is ${amount}, senderAddress is ${senderAddress}`);
      this.props.onBet(contractAddress, selectedIndex, amount, senderAddress);
    } else if (this.state.config.name === 'SETTING') {
      this.props.onSetResult(contractAddress, selectedIndex, senderAddress);
    } else if (this.state.config.name === 'VOTING') {
      this.props.onVote(contractAddress, selectedIndex, amount, senderAddress);
    }
  }

  onFinalizeResult() {
    const contractAddress = '9697b1f2701ca9434132723ee790d1cb0ab0e414';
    const senderAddress = 'qKjn4fStBaAtwGiwueJf9qFxgpbAvf1xAy';

    this.props.onFinalizeResult(contractAddress, senderAddress);
  }

  /** Return selected address on Topbar as sender * */
  getCurrentSenderAddress() {
    const { walletAddrs, walletAddrsIndex } = this.props;
    return walletAddrs[walletAddrsIndex].address;
  }

  render() {
    const { editingToggled, requestReturn } = this.props;
    const { oracle, config } = this.state;

    if (!oracle) {
      // TODO: render no result page
      return <div></div>;
    }

    const timeline = [{
      label: 'Prediction start block',
      value: oracle.blockNum,
    }, {
      label: 'Prediction end block',
      value: oracle.endBlock,
    }];

    const totalBalance = _.sum(oracle.amounts);
    const { token } = oracle;

    const betBalance = OraclePage.getBetOrVoteArray(oracle);
    const breadcrumbLabel = config && config.breadcrumbLabel;

    const oracleElement = (
      <Row
        gutter={28}
        justify="center"
      >

        <Col xl={12} lg={12}>
          <IsoWidgetsWrapper padding="32px" >
            <CardInfo
              title={oracle.name}
              timeline={timeline}
            >
            </CardInfo>
          </IsoWidgetsWrapper>

        </Col>
        <Col xl={12} lg={12}>
          <IsoWidgetsWrapper padding="32px">
            <CardVoting
              amount={totalBalance}
              config={config}
              token={token}
              voteBalance={betBalance}
              onSubmit={this.onConfirmBtnClicked}
              radioIndex={this.state.radioValue}
              result={requestReturn}
            >
              {editingToggled
                ?
                (
                  <RadioGroup
                    onChange={this.onRadioGroupChange}
                    value={this.state.radioValue}
                    size="large"
                    defaultValue={DEFAULT_RADIO_VALUE}
                  >
                    {betBalance.map((entry, index) => (
                      <Radio value={index + 1} key={entry.name}>
                        <ProgressBar
                          label={entry.name}
                          value={entry.value}
                          percent={entry.percent}
                          barHeight={12}
                          info
                        />
                      </Radio>))
                    }
                  </RadioGroup>
                )
                :
                betBalance.map((entry) => (
                  <ProgressBar
                    key={entry.name}
                    label={entry.name}
                    value={entry.value}
                    percent={entry.percent}
                    barHeight={12}
                    info
                    marginBottom={18}
                  />))
              }
            </CardVoting>
          </IsoWidgetsWrapper>
        </Col>

      </Row>);

    return (
      <LayoutContentWrapper className="horizontalWrapper" style={{ minHeight: '100vh' }}>
        <Row style={{ width: '100%', height: '48px' }}>
          <Breadcrumb style={{ fontSize: '16px' }}>
            <Breadcrumb.Item><Link to="/">Event</Link></Breadcrumb.Item>
            <Breadcrumb.Item>{breadcrumbLabel}</Breadcrumb.Item>
          </Breadcrumb>
        </Row>
        <Row style={{ width: '100%' }}>
          {oracleElement}
        </Row>
      </LayoutContentWrapper>
    );
  }
}

OraclePage.propTypes = {
  onGetOracles: PropTypes.func,
  getOraclesSuccess: PropTypes.oneOfType([
    PropTypes.array, // Result array
    PropTypes.string, // error message
    PropTypes.bool, // No result
  ]),
  // getOraclesError: PropTypes.string,
  editingToggled: PropTypes.bool,
  match: PropTypes.object.isRequired,
  onBet: PropTypes.func,
  onVote: PropTypes.func,
  // betReturn: PropTypes.object,
  requestReturn: PropTypes.object,
  onClearRequestReturn: PropTypes.func,
  onSetResult: PropTypes.func,
  onFinalizeResult: PropTypes.func,
  finalizeResultReturn: PropTypes.object,
  walletAddrs: PropTypes.array,
  walletAddrsIndex: PropTypes.number,
};

OraclePage.defaultProps = {
  onGetOracles: undefined,
  getOraclesSuccess: [],
  // getOraclesError: '',
  editingToggled: false,
  onBet: undefined,
  onVote: undefined,
  onSetResult: undefined,
  onFinalizeResult: undefined,
  onClearRequestReturn: undefined,
  requestReturn: undefined,
  finalizeResultReturn: undefined,
  walletAddrs: [],
  walletAddrsIndex: 0,
};

const mapStateToProps = (state) => ({
  getOraclesSuccess: state.Dashboard.get('allOraclesSuccess') && state.Dashboard.get('allOraclesValue'),
  // getOraclesError: !state.Dashboard.get('allOraclesSuccess') && state.Dashboard.get('allOraclesValue'),
  editingToggled: state.Topic.get('toggled'),
  requestReturn: state.Topic.get('req_return'),
  finalizeResultReturn: state.Topic.get('finalize_result_return'),
  walletAddrs: state.App.get('walletAddrs'),
  walletAddrsIndex: state.App.get('walletAddrsIndex'),
});

function mapDispatchToProps(dispatch) {
  return {
    onGetOracles: () => dispatch(dashboardActions.getOracles()),
    onBet: (contractAddress, index, amount, senderAddress) =>
      dispatch(topicActions.onBet(contractAddress, index, amount, senderAddress)),
    onClearRequestReturn: () => dispatch(topicActions.onClearRequestReturn()),
    onVote: (contractAddress, index, amount, senderAddress) =>
      dispatch(topicActions.onVote(contractAddress, index, amount, senderAddress)),
    onSetResult: (contractAddress, resultIndex, senderAddress) =>
      dispatch(topicActions.onSetResult(contractAddress, resultIndex, senderAddress)),
    onFinalizeResult: (contractAddress, senderAddress) =>
      dispatch(topicActions.onFinalizeResult(contractAddress, senderAddress)),
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(OraclePage);
