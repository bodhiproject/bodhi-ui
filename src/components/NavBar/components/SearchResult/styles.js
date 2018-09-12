

const styles = (theme) => ({
  resultWrapper: {
    boxShadow: '0px 0px 4px 0px rgba(0,0,0,0.25) inset',
    background: 'white',
    alignItems: 'flex-start',
    overflowY: 'scroll',
    height: 'calc(100vh - 70px)',
  },
  result: {
    margin: '40px',
    padding: '0px 40px 40px 40px',
  },
  searchTabWrapper: {
    background: theme.palette.background.paper,
    top: theme.sizes.navHeight,
    left: 0,
    right: 0,
    height: '56px',
  },
  searchTabButton: {
    marginTop: '0px',
    marginBottom: '0px',
    paddingTop: '3px',
    paddingBottom: '5px',
    height: '56px',
    color: 'black',
  },
  searchTabContainer: {
    marginTop: theme.sizes.navHeight,
  },
});

export default styles;
