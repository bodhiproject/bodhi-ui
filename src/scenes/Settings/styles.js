const styles = (theme) => ({
  root: {
    padding: theme.padding.lg.px,
  },
  headerText: {
    marginBottom: theme.padding.md.px,
  },
  settingGridContainer: {
    padding: `${theme.padding.sm.px} 0`,
  },
  settingName: {
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.padding.unit.px,
    },
  },
});

export default styles;
