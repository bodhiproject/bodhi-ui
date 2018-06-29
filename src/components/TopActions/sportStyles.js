const styles = (theme) => ({
  createEventButton: {
    background: 'white',
    color: theme.palette.text.primary,
    position: 'relative',
    paddingLeft: '60px',
    '&:hover': {
      color: 'white',
    },
  },
  sportCreateIcon: {
    height: '54px',
    position: 'absolute',
    left: '10px',
    top: '-15px',
  },
});

export default styles;
