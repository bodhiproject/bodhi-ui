const styles = (theme) => ({
  activitiesTabWrapper: {
    position: 'fixed',
    top: theme.sizes.navHeight.px,
    left: 0,
    right: 0,
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
      fontSize: theme.sizes.font.xxSmall,
    },
  },
  activitiesTabContainer: {
    marginTop: theme.sizes.navHeight.px,
  },
  notLoggedInContainer: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.padding.space7X.px,
  },
  notLoggedInIcon: {
    fontSize: 80,
    marginBottom: theme.padding.spaceX.px,
  },
  notLoggedInText: {
    textAlign: 'center',
  },
});

export default styles;
