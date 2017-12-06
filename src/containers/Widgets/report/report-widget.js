import React, { Component, PropTypes } from 'react';

const labelStyle = {
  'font-size': '24px',
  padding: '0px',
};

export default class ReportsWidget extends Component {
  render() {
    const { label, details, children } = this.props;

    let detailsArray = (details instanceof Array) ? details : [details];

    detailsArray = detailsArray.map((entry) =>
      <p key={entry} className="isoDescription">{entry}</p>);

    return (
      <div>
        <h3 style={labelStyle} >{label}</h3>

        <div>
          {children}
        </div>

        <div
          style={{
            padding: '24px 0px 24px 0px',
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
