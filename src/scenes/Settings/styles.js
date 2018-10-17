const styles = (theme) => ({
  root: {
    padding: theme.padding.space7X.px,
  },
  headerText: {
    marginBottom: theme.padding.space5X.px,
  },
  settingGridContainer: {
    padding: `${theme.padding.space3X.px} 0`,
  },
  settingName: {
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.padding.spaceX.px,
    },
  },
});

export default styles;
