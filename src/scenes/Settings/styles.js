const styles = (theme) => ({
  root: {
    [theme.breakpoints.up('sm')]: {
      padding: theme.padding.space7X.px,
    },
    maxWidth: 1000,
  },
  headerText: {
    marginBottom: theme.padding.space2X.px,
  },
  settingContainer: {
    marginBottom: theme.padding.spaceX.px,
  },
  settingDescription: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
  },
  settingName: {
    [theme.breakpoints.down('xs')]: {
      marginBottom: theme.padding.spaceX.px,
    },
  },
  flag: {
    width: theme.sizes.font.medium,
    verticalAlign: 'middle',
    paddingRight: theme.padding.spaceX.px,
  },
});

export default styles;
