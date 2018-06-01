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
  },
});

export default styles;
