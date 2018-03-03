const styles = (theme) => ({
  root: {
    background: theme.palette.background.default,
  },
  container: {
    paddingTop: '80px',
    // [theme.breakpoints.up('xs')]: {
    //   margin: theme.padding.sm.px,
    // },

    // [theme.breakpoints.up('sm')]: {
    //   margin: theme.padding.md.px,
    // },

    // [theme.breakpoints.up('lg')]: {
    //   margin: '0 auto',
    //   marginTop: theme.padding.md.px,
    //   marginBottom: theme.padding.md.px,
    //   maxWidth: (theme.breakpoints.values.lg - (theme.padding.md.value * 2)),
    // },

    // [theme.breakpoints.up('xl')]: {
    //   maxWidth: (theme.breakpoints.values.xl - (theme.padding.md.value * 2)),
    // },
  },
});

export default styles;
