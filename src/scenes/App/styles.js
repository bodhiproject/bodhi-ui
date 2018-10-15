const styles = (theme) => ({
  root: {
    background: theme.palette.background.default,
  },
  container: {
    margin: `${theme.sizes.navHeight.px} ${theme.padding.md.px} ${theme.padding.md.px} ${theme.padding.md.px}`,
    padding: `${theme.padding.md.px} 0 0 0`,
    [theme.breakpoints.down('xs')]: {
      margin: `${theme.sizes.navHeight} ${theme.padding.unit.px} ${theme.padding.lg.px} ${theme.padding.unit.px}`,
      padding: `${theme.padding.unit.px} 0 0 0`,
    },
    [theme.breakpoints.up('xl')]: {
      margin: '0 auto',
      marginTop: theme.padding.md.px,
      marginBottom: theme.padding.md.px,
      maxWidth: (theme.breakpoints.values.xl - (theme.padding.md.value * 2)),
    },
  },
});

export default styles;
