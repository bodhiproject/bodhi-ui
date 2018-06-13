const styles = (theme) => ({
  activitiesTabWrapper: {
    background: theme.palette.background.paper,
    position: 'fixed',
    top: theme.sizes.navHeight,
    left: 0,
    right: 0,
  },
  activitiesTabButton: {
    marginTop: '0px',
    marginBottom: '0px',
    paddingTop: '8px',
    paddingBottom: '7px',
  },
  activitiesTabContainer: {
    marginTop: theme.sizes.navHeight,
  },
});

export default styles;
