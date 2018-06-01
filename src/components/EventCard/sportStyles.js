const styles = (theme) => ({
  eventCardSection: {
    '&.top': {
      marginTop: '30px',
    },
  },
  eventCardBg: {
    position: 'absolute',
    left: theme.padding.sm.px,
    right: 0,
    height: '40px',
    backgroundImage: 'url(/images/sports-card-1.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'right',
    backgroundRepeat: 'no-repeat',
    '&:nth-child(8n+1)': {
      backgroundImage: 'url(/images/sports-card-1.png)',
    },
    '&:nth-child(8n+2)': {
      backgroundImage: 'url(/images/sports-card-1.png)',
    },
    '&:nth-child(8n+3)': {
      backgroundImage: 'url(/images/sports-card-1.png)',
    },
    '&:nth-child(8n+4)': {
      backgroundImage: 'url(/images/sports-card-1.png)',
    },
    '&:nth-child(8n+5)': {
      backgroundImage: 'url(/images/sports-card-1.png)',
    },
    '&:nth-child(8n+6)': {
      backgroundImage: 'url(/images/sports-card-1.png)',
    },
    '&:nth-child(8n+7)': {
      backgroundImage: 'url(/images/sports-card-1.png)',
    },
  },
});

export default styles;
