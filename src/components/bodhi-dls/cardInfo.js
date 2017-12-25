import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import { Steps, Icon } from 'antd';

const { Step } = Steps;

class CardInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const { title, config } = this.props;
    const { steps, messages } = config;

    const titleLineHeight = 36;

    const iconStyle = {
      marginLeft: '6px',
      marginRight: '12px',
      lineHeight: '28px',
    };

    let stepsEle;

    if (steps) {
      stepsEle = (<Steps direction="vertical" current={steps.current} style={{ marginBottom: '24px' }} size="default">
        {_.map(steps.value, (item, index) =>
          <Step title={item.title} description={item.description} key={`step #${index + 1}`} />)}
      </Steps>);
    }

    return (
      <div style={{ marginBottom: '24px' }}>
        <h3
          style={{
            fontSize: '24px',
            lineHeight: `${titleLineHeight}px`,
          }}
        >{title}</h3>
        <div
          style={{
            padding: '32px 0px',
            color: '#4A4A4A',
            lineHeight: 2,
          }}
        >

          {stepsEle}

          <ul>
            {_.map(messages, (item, index) => {
              let iconEle = <Icon type="info-circle-o" style={iconStyle} />; // type: default

              if (item.type === 'warn') {
                iconEle = <Icon type="exclamation-circle-o" style={_.assign({}, iconStyle, { color: 'orange' })} />;
              }

              return (<li key={`message #${index + 1}`}>
                <div style={{ display: 'flex' }}>{iconEle}<p style={{ fontSize: '14px' }}>{item.text}</p></div>
              </li>);
            })}
          </ul>
        </div>
      </div>
    );
  }
}

CardInfo.propTypes = {
  title: PropTypes.string.isRequired,
  config: PropTypes.object.isRequired,
};

CardInfo.defaultProps = {
};

export default CardInfo;
