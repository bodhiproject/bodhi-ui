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
    width: '200px',
    height: '400px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-200px',
    marginLeft: '-100px',
  },
  loaderLogoWrapper: {
    position: 'relative',
    width: '200px',
    height: '200px',
    backgroundImage: 'url(/images/loading-logo.png)',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  },
  loaderGif: {
    width: '100px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-50px',
    marginLeft: '-50px',
  },
  loaderInfoWrapper: {
    textAlign: 'center',
    marginTop: theme.padding.sm.px,
  },
  loaderPercent: {
    display: 'inline-block',
    marginRight: '4px',
    fontSize: '50px',
  },
});

export default styles;
