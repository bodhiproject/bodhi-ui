import React, { Component, PropTypes } from 'react';

class CardInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    const { title, /* description, */ timeline } = this.props;

    const timelineArray = timeline.map((entry) =>

      (<div key={entry.label} className="timeline" style={{ marginBottom: '18px' }}>
        <h4>{entry.label}</h4>
        <p>{entry.value}</p>
      </div>));

    const titleLineHeight = 36;

    return (
      <div style={{ marginBottom: '24px' }}>
        <h3
          style={{
            fontSize: '24px',
            lineHeight: `${titleLineHeight}px`,
            height: `${titleLineHeight * 2}px`,
          }}
        >{title}</h3>
        <div
          style={{
            padding: '32px 0px',
            color: '#4A4A4A',
            lineHeight: 2,
          }}
        >
          {timelineArray}
        </div>
      </div>
    );
  }
}

CardInfo.propTypes = {
  title: PropTypes.string,
  // description: PropTypes.string,
  timeline: PropTypes.array,
};

CardInfo.defaultProps = {
  title: '',
  // description: '',
  timeline: [],
};

export default CardInfo;
