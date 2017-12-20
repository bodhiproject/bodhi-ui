import React, { PropTypes } from 'react';

const labelStyle = {
  fontSize: '24px',
  padding: '0px',
  height: '72px', // Fix title to 2 lines of text and use gradient effect to indicate there are more
  overflow: 'hidden',
};

export default class ReportsWidget extends React.PureComponent {
  render() {
    const { label, details, children } = this.props;

    let detailsArray = (details instanceof Array) ? details : [details];

    detailsArray = detailsArray.map((entry) =>
      <p key={entry} className="isoDescription">{entry}</p>);

    return (
      <div className="report-widget">
        <h3 style={labelStyle} className={label.length > 63 ? 'gradient' : ''} >{label}</h3>

        <div>
          {children}
        </div>

        <div
          style={{
            padding: '0px 0px 24px 0px',
            fontSize: '16px',
            color: '#4A4A4A',
            fontWeight: 500,
            lineHeight: 2,
          }}
        >
          {detailsArray}
        </div>
      </div>
    );
  }
}

ReportsWidget.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.element,
  ]),
  label: PropTypes.string,
  details: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
  ]),
};

ReportsWidget.defaultProps = {
  children: [],
  label: '',
  details: [],
};
