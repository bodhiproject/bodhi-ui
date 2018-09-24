const styles = (theme) => ({
  activitiesTabWrapper: {
    background: theme.palette.background.paper,
    position: 'fixed',
    top: theme.sizes.navHeight,
    left: 0,
    right: 0,
    height: '56px',
  },
  activitiesTabButton: {
    marginTop: '0px',
    marginBottom: '0px',
    paddingTop: '3px',
    paddingBottom: '5px',
    height: '56px',
  },
  activitiesTabLabel: {
    [theme.breakpoints.down('xs')]: {
      fontSize: 12,
    },
  },
  activitiesTabContainer: {
    marginTop: theme.sizes.navHeight,
  },
  notLoggedInContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  notLoggedInIcon: {
    fontSize: 100,
  },
  notLoggedInText: {
    textAlign: 'center',
  },
});

export default styles;
