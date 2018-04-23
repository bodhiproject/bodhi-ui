const styles = (theme) => ({
  loaderBg: {
    background: 'white',
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 999999,
    transition: 'opacity 1s;',
  },
  loaderWrapper: {
    width: '50vw',
    height: '480px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    textAlign: 'center',
    marginTop: '-240px',
    marginLeft: '-25vw',
  },
});

export default styles;
