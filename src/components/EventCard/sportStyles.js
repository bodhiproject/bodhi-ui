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
    height: '50px',
    backgroundImage: 'url(/images/sports-card-1.png)',
    backgroundSize: 'cover',
    backgroundPosition: 'right',
    backgroundRepeat: 'no-repeat',
    '&.bg1': {
      backgroundImage: 'url(/images/sports-card-2.png)',
    },
    '&.bg2': {
      backgroundImage: 'url(/images/sports-card-3.png)',
    },
    '&.bg3': {
      backgroundImage: 'url(/images/sports-card-4.png)',
    },
    '&.bg4': {
      backgroundImage: 'url(/images/sports-card-5.png)',
    },
    '&.bg5': {
      backgroundImage: 'url(/images/sports-card-6.png)',
    },
    '&.bg6': {
      backgroundImage: 'url(/images/sports-card-7.png)',
    },
    '&.bg7': {
      backgroundImage: 'url(/images/sports-card-8.png)',
    },
  },
});

export default styles;
