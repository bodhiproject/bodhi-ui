import React, { PropTypes } from 'react';
import Progress from '../../../components/Progress/index';

export default class SingleProgressWidget extends React.PureComponent {
  render() {
    const {
      label, percent, barHeight, fontColor, barColor, secondaryPercent, secondaryBarHeight,
    } = this.props;

    const wrapperStyle = { marginTop: '18px', marginBottom: '18px' };

    const titleStyle = {
      color: fontColor,
      fontSize: '16px',
      fontWeight: 300,
      height: '24px', // Fix option name height so all are the same even without text
    };

    return (
      <div className="isoSingleProgressBar" style={wrapperStyle}>
        <h3 style={titleStyle}>{label}</h3>
        <Progress
          className={barColor}
          percent={percent}
          strokeWidth={barHeight}
          status="active"
          showInfo
        />
        {typeof secondaryPercent !== 'undefined' ? <Progress
          className={barColor || 'secondary'}
          percent={secondaryPercent}
          strokeWidth={secondaryBarHeight}
          status="active"
          showInfo
        /> : null}
      </div>
    );
  }
}

SingleProgressWidget.propTypes = {
  label: PropTypes.string.isRequired,
  percent: PropTypes.number.isRequired,
  barHeight: PropTypes.number.isRequired,
  fontColor: PropTypes.string,
  barColor: PropTypes.string,
  secondaryPercent: PropTypes.number,
  secondaryBarHeight: PropTypes.number,
};

SingleProgressWidget.defaultProps = {
  fontColor: '#000',
  barColor: '',
  secondaryPercent: undefined,
  secondaryBarHeight: undefined,
};
