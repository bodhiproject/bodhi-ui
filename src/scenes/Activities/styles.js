const styles = (theme) => ({
  activitiesTabWrapper: {
    background: theme.palette.background.paper,
    position: 'fixed',
    top: theme.sizes.navHeight,
    left: 0,
    right: 0,
    height: '64px',
  },
  activitiesTabButton: {
    marginTop: '0px',
    marginBottom: '0px',
    paddingTop: '8px',
    paddingBottom: '8px',
    height: '64px',
  },
  activitiesTabContainer: {
    marginTop: theme.sizes.navHeight,
  },
});

export default styles;
