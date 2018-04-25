const styles = (theme) => ({
  loaderBg: {
    background: 'white',
    position: 'fixed',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    zIndex: 999998,
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
  loaderLogoWrapper: {
    position: 'relative',
    width: '200px',
    height: '200px',
    backgroundImage: 'url(/images/loading-logo.png)',
    backgroundSize: 'contain',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'inline-block',
  },
  loaderGif: {
    width: '100px',
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-50px',
    marginLeft: '-50px',
  },
  loaderPercentWrapper: {
    marginTop: theme.padding.sm.px,
  },
  loaderPercent: {
    display: 'inline-block',
    marginRight: '4px',
    fontSize: '50px',
  },
  loaderProgressWrapper: {
    width: '50vw',
    padding: '4px',
    background: 'white',
    borderRadius: '14px',
    boxShadow: '0 0 8px rgba(0,0,0,0.15)',
    marginTop: theme.padding.sm.px,
    marginBottom: theme.padding.xs.px,
  },
  loaderProgress: {
    height: '10px',
  },
  loaderInfoWrapper: {
    marginTop: theme.padding.sm.px,
  },
  loaderInfoLabel: {
    fontWeight: 'bold',
    textAlign: 'right',
    padding: theme.padding.unit.px,
  },
  loaderInfoData: {
    textAlign: 'left',
    padding: theme.padding.unit.px,
  },
});

export default styles;
