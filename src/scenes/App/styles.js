const styles = (theme) => ({
  root: {
    background: theme.palette.background.default,
  },
  container: {
    margin: `${theme.sizes.navHeight.px} ${theme.padding.space5X.px} ${theme.padding.space5X.px} ${theme.padding.space5X.px}`,
    padding: `${theme.padding.space5X.px} 0 0 0`,
    [theme.breakpoints.down('xs')]: {
      margin: `${theme.sizes.navHeight.px} ${theme.padding.spaceX.px} ${theme.padding.space7X.px} ${theme.padding.spaceX.px}`,
      padding: `${theme.padding.spaceX.px} 0 0 0`,
    },
    [theme.breakpoints.up('xl')]: {
      margin: '0 auto',
      marginTop: theme.padding.space5X.px,
      marginBottom: theme.padding.space5X.px,
      maxWidth: (theme.breakpoints.values.xl - (theme.padding.space5X.value * 2)),
    },
  },
});

export default styles;
