const styles = theme => ({
  root: {
    // minWidth: 640,
    flexGrow: 1,
    border: '1px solid #585AFA',
    textAlign: 'center',
    marginTop: '40px',
  },
  sds: {
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
    boxShadow: 'none',
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
    bottom: '15px',
    color: 'white',
    fontWeight: 'bold',
    marginLleft: 'auto',
    marginRight: 'auto',
    left: '0px',
    right: '0px',
  },
  flag: {
    width: '90%',
    maxWidth: '385px',
    height: '48px',
  },
  ii: {
    position: 'relative',
    top: '-15px',
  },
  board: {
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingBottom: '60px',
  },
  table: {
    marginTop: '0px',
    border: ' 0px',
  },
  tableHead: {
    background: '#FFFFFF',
  },
  mobileStepper: {
    borderBottom: '2px solid #585AFA',
  },
  entry: {
    borderColor: 'rgba(151, 151, 151, 0.1)',
    border: '1px solid',
    borderBottom: '1px solid',
  },
});

export default styles;
