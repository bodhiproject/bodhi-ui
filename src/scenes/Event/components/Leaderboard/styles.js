const styles = theme => ({
  root: {
    // maxWidth: 400,
    flexGrow: 1,
    border: '1px solid #585AFA',
    textAlign: 'center',
    marginTop: '20px',
  },
  sds: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    paddingLeft: theme.spacing.unit * 4,
    // backgroundColor: theme.palette.background.default,
  },
  img: {
    height: 255,
    maxWidth: 400,
    overflow: 'hidden',
    display: 'block',
    width: '100%',
  },
  im: {
    position: 'absolute',
    left: '45%',
    bottom: '15px',
    color: 'white',
    fontWeight: 'bold',
  },
  ii: {
    position: 'relative',
    top: '-15px',
  },
  board: {

  },
});

export default styles;
