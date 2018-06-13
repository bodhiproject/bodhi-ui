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
  activitiesTabContainer: {
    marginTop: theme.sizes.navHeight,
  },
});

export default styles;
