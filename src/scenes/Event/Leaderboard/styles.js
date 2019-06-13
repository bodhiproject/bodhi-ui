const styles = theme => ({
  root: {
    flexGrow: 1,
    border: '1px solid #585AFA',
    textAlign: 'center',
    marginTop: '40px',
  },
  outWrapper: {
    marginTop: theme.spacing(3),
    boxShadow: 'none',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    paddingLeft: theme.spacing(4),
  },
  img: {
    height: 255,
    maxWidth: 400,
    overflow: 'hidden',
    display: 'block',
    width: '100%',
  },
  leaderboardText: {
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
  leaderboardTitle: {
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
  grid: {
    borderBottom: theme.border,
    fontFamily: 'Lato, Helvetica, Arial, sans-serif',
    fontWeight: '700',
    color: '#666666',
    fontSize: '0.75rem',
    height: '2rem',
  },
});

export default styles;
